/**
 * Edge Function: submeter-resposta
 *
 * Recebe a resposta do aluno, verifica contra o gabarito no schema private,
 * retorna se acertou + gabarito. Não expõe o gabarito antes da submissão.
 *
 * POST /functions/v1/submeter-resposta
 * Body: { questao_id: string, resposta: string, topico_id?: string }
 * Auth: Bearer token do aluno (JWT)
 *
 * TODO Fase 5: adicionar lógica de mastery score + agendamento de revisão
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Não autenticado' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Client com service_role para acessar private.gabaritos
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    // Client autenticado como o aluno (para inserir tentativa com RLS)
    const supabaseAluno = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    )

    const { data: { user }, error: authError } = await supabaseAluno.auth.getUser()
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Token inválido' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const body = await req.json()
    const { questao_id, resposta, topico_id } = body as {
      questao_id: string
      resposta: string
      topico_id?: string
    }

    if (!questao_id || !resposta) {
      return new Response(JSON.stringify({ error: 'questao_id e resposta são obrigatórios' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Busca gabarito no schema private (apenas service_role tem acesso)
    const { data: gab, error: gabError } = await supabaseAdmin
      .schema('private' as never)
      .from('gabaritos')
      .select('gabarito')
      .eq('questao_id', questao_id)
      .single()

    if (gabError || !gab) {
      return new Response(JSON.stringify({ error: 'Questão não encontrada' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const acertou = resposta.toUpperCase() === gab.gabarito

    // Verifica se já respondeu (para calcular peso)
    const { data: jaRespondida } = await supabaseAluno
      .from('tentativas')
      .select('id')
      .eq('questao_id', questao_id)
      .limit(1)

    const pesoEfetivo = jaRespondida && jaRespondida.length > 0 ? 0.3 : 1.0

    // Insere tentativa (imutável — sem UPDATE/DELETE policy)
    await supabaseAluno.from('tentativas').insert({
      aluno_id: user.id,
      questao_id,
      topico_id: topico_id ?? null,
      resposta_marcada: resposta.toUpperCase(),
      acertou,
      tipo_servimento: 'pratica',
      peso_efetivo: pesoEfetivo,
    })

    // TODO: atualizar estado_topico via trigger ou aqui (Fase 5)

    return new Response(
      JSON.stringify({
        acertou,
        gabarito: gab.gabarito,
        peso_efetivo: pesoEfetivo,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
