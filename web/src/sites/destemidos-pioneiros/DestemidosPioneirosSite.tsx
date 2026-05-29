import { useEffect } from 'react'
import './theme.css'

// Microsite TOP 1270 — Destemidos Pioneiros
// Conteúdo espelha content/destemidos-pioneiros/copy/*.md (single source of truth editorial).
// Tokens de marca espelham content/destemidos-pioneiros/brand/{palette,typography}.json via theme.css.

const NAV = [
  { href: '#sobre',         label: 'Sobre' },
  { href: '#historia',      label: 'Por que Destemidos' },
  { href: '#metodologia',   label: 'Metodologia' },
  { href: '#programacao',   label: 'Programação' },
  { href: '#kit',           label: 'O que levar' },
  { href: '#inscricao',     label: 'Inscrição' },
  { href: '#faq',           label: 'FAQ' },
  { href: '#contato',       label: 'Contato' },
]

const KIT = [
  { title: 'Mochila',    items: 'Até 60 L · ~14 kg no total · capa impermeável' },
  { title: 'Roupas',     items: 'Calça esportiva (sem jeans) · manga curta e longa · jaqueta impermeável · luvas · meias' },
  { title: 'Acampar',    items: 'Copo de alumínio · talheres · garrafa + 1 L de água · sem alimentos' },
  { title: 'Higiene',    items: 'Toalha · papel higiênico · pomada para assaduras · repelente · protetor solar' },
  { title: 'Específicos',items: 'Lanterna de cabeça + pilhas · Bíblia (impermeável, obrigatória) · 5 ziplocks · ~200 g de cal' },
  { title: 'Proibido',   items: 'Lâminas cortantes · eletrônicos — você fica incomunicável durante todo o TOP' },
]

const PHASES = [
  { day: '02/10', label: 'Chamado',   blurb: 'Check-in, acolhida, primeiro desafio. O homem deixa para trás a versão que veio sendo.' },
  { day: '03/10', label: 'Confronto', blurb: 'O peso real começa. Cair, levantar, carregar o outro. Onde mora a sua resistência?' },
  { day: '04/10', label: 'Travessia', blurb: 'O ponto mais alto. A noite mais longa. A escolha que define o resto.' },
  { day: '05/10', label: 'Retorno',   blurb: 'Descida em formação. Cerimônia de entrega. O homem volta com outro nome.' },
]

const NUMBERS = [
  { value: '1270',   label: 'Edição do TOP em Porto Velho' },
  { value: '90 mil', label: 'Legendários formados no mundo' },
  { value: '25 mil', label: 'No Brasil, em 18 estados' },
  { value: '4×3',    label: 'Dias e noites na montanha' },
]

const FAQ = [
  { q: 'Preciso ter preparo físico atlético?',
    a: 'Não. A trilha foi desenhada para homens comuns. Recomendamos caminhadas e atividade aeróbica nas semanas anteriores — o desafio, porém, é mais de cabeça e coração do que de músculo.' },
  { q: 'Preciso ser cristão / religioso?',
    a: 'O movimento nasce em ambiente cristão e tem oração na espinha dorsal. Homens de outras tradições — ou sem tradição — são acolhidos, desde que abertos ao formato. A liderança será transparente sobre cada momento ritual.' },
  { q: 'Vou ficar sem celular?',
    a: 'Sim. Telefones são entregues na chegada e devolvidos no Retorno. Em emergência familiar, a equipe tem contato direto com você.' },
  { q: 'E se eu não der conta da subida?',
    a: 'Ninguém é deixado para trás. Há equipe médica e logística em todos os pontos. Já vimos homens de 60 anos, sedentários, com sobrepeso, concluírem o TOP.' },
  { q: 'Posso levar acompanhante?',
    a: 'A travessia é estritamente individual. A família participa apenas da cerimônia de entrega, no domingo à tarde.' },
  { q: 'Preciso levar Bíblia?',
    a: 'Sim — a Bíblia é item obrigatório, em embalagem impermeável. A trilha também proíbe lâminas cortantes e qualquer alimento (salvo dieta restrita). A lista completa é enviada após a confirmação.' },
]

export default function DestemidosPioneirosSite() {
  useEffect(() => {
    document.title = 'TOP 1270 — Destemidos Pioneiros · Movimento Legendários · Porto Velho'
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content',
      'TOP 1270 do Movimento Legendários em Porto Velho (RO), de 02 a 05 de outubro de 2025. Quatro dias e três noites de travessia para homens dispostos a encontrar a melhor versão de si.'
    )
  }, [])

  return (
    <div data-site="destemidos-pioneiros">
      {/* Top nav */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--dp-bone)', borderBottom: '1px solid var(--dp-n-200)' }}>
        <div className="dp-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1.25rem' }}>
          <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', color: 'var(--dp-ink)' }}>
            <span style={{ width: 28, height: 28, background: 'var(--dp-blood)', display: 'inline-block', borderRadius: 6 }} />
            <strong className="dp-display" style={{ fontSize: '1.1rem' }}>TOP 1270 · Destemidos Pioneiros</strong>
          </a>
          <nav style={{ display: 'flex', gap: '1.1rem', alignItems: 'center', fontSize: '0.9rem' }}>
            {NAV.map(n => (
              <a key={n.href} href={n.href} style={{ color: 'var(--dp-n-700)', textDecoration: 'none' }}>{n.label}</a>
            ))}
            <a href="#inscricao" className="dp-btn dp-btn-primary" style={{ padding: '0.55rem 1rem' }}>Inscreva-se</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="dp-onyx dp-section">
        <div className="dp-container">
          <div className="dp-eyebrow">TOP 1270 · Movimento Legendários · Porto Velho</div>
          <h1 className="dp-h1" style={{ marginTop: '0.75rem', marginBottom: '1.5rem', color: 'var(--dp-bone)' }}>
            Destemidos<br />Pioneiros
          </h1>
          <p className="dp-lead" style={{ color: 'var(--dp-n-300)', maxWidth: '54ch' }}>
            Quatro dias. Três noites. Uma montanha. Uma travessia para encontrar a melhor versão do homem que mora dentro de você — no mesmo chão onde os pioneiros do Norte ergueram uma capital do zero.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem', flexWrap: 'wrap' }}>
            <a href="/destemidos-pioneiros/inscricao" className="dp-btn dp-btn-primary">Quero ser um Legendário →</a>
            <a href="#sobre" className="dp-btn dp-btn-ghost" style={{ color: 'var(--dp-bone)' }}>Conheça o TOP 1270</a>
          </div>
          <div style={{ marginTop: '3rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--dp-clay)' }}>
            <span className="dp-tag" style={{ background: 'transparent', border: '1px solid currentColor', color: 'inherit' }}>02 — 05 OUT 2025</span>
            <span style={{ opacity: 0.7 }}>· Porto Velho/RO</span>
          </div>
        </div>
      </section>

      {/* Numbers strip */}
      <section className="dp-section" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
        <div className="dp-container dp-grid">
          {NUMBERS.map(n => (
            <div key={n.label}>
              <div className="dp-display" style={{ fontSize: '2.5rem', color: 'var(--dp-blood)' }}>{n.value}</div>
              <div style={{ color: 'var(--dp-n-700)', fontSize: '0.95rem' }}>{n.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Sobre */}
      <section id="sobre" className="dp-section" style={{ background: 'white', borderTop: '1px solid var(--dp-n-200)', borderBottom: '1px solid var(--dp-n-200)' }}>
        <div className="dp-container" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.4fr)', gap: '3rem' }}>
          <div>
            <div className="dp-eyebrow">Sobre o Movimento</div>
            <h2 className="dp-h2" style={{ marginTop: '0.75rem' }}>Uma travessia para a transformação do homem.</h2>
          </div>
          <div>
            <p className="dp-lead">
              O Movimento Legendários conduz cada participante a reencontrar a sua melhor versão, restaurar propósito e voltar para casa pronto para liderar com integridade — no lar, no trabalho e na cidade.
            </p>
            <p className="dp-lead" style={{ marginTop: '1.25rem' }}>
              Nascido em <strong>23 de julho de 2015 na Guatemala</strong> pelas mãos do pastor Chepe Putzu, hoje conta com mais de <strong>90 mil Legendários</strong> no mundo. Chegou ao Brasil em <strong>2017</strong>, e em <strong>novembro de 2018</strong> realizou o primeiro TOP nacional, em Balneário Camboriú (SC), pelos chamados <em>Pioneiros Brasil</em>. Em poucos anos, o país se tornou o maior contingente global do movimento.
            </p>
            <p className="dp-lead" style={{ marginTop: '1.25rem' }}>
              Cada edição recebe um nome próprio e um número sequencial. Em Porto Velho, o número é <strong>1270</strong> — e o nome, <strong>Destemidos Pioneiros</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* História / Regional */}
      <section id="historia" className="dp-section">
        <div className="dp-container">
          <div className="dp-eyebrow">Por que "Destemidos Pioneiros"</div>
          <h2 className="dp-h2" style={{ marginTop: '0.75rem', maxWidth: '20ch' }}>Um verso, um povo, uma travessia.</h2>
          <div className="dp-divider" />

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '3rem', alignItems: 'start' }}>
            <div>
              <blockquote className="dp-quote">
                "Somos destemidos pioneiros…"<br />
                <span style={{ display: 'block', marginTop: '0.5rem', fontSize: '0.95rem', color: 'var(--dp-n-500)', fontStyle: 'normal', letterSpacing: '0.05em' }}>— Hino do Estado de Rondônia</span>
              </blockquote>
              <p className="dp-lead" style={{ marginTop: '1.5rem' }}>
                O nome do TOP 1270 não é metáfora — é citação. Vem do Hino de Rondônia, que canta a coragem dos homens e mulheres que construíram um estado novo na fronteira da Amazônia. Trazer essa frase para a montanha é assumir uma herança: o Legendário que cruza essa trilha sobe carregando a memória de quem desbravou estes rios e estas florestas antes dele.
              </p>
            </div>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div className="dp-card">
                <div className="dp-tag" style={{ background: 'var(--dp-clay)', color: 'white' }}>EFMM · 1907</div>
                <h3 className="dp-display" style={{ marginTop: '0.6rem', fontSize: '1.35rem' }}>A herança da Madeira-Mamoré</h3>
                <p style={{ marginTop: '0.5rem', color: 'var(--dp-n-700)' }}>
                  Porto Velho nasceu por volta de 1907, durante a construção da lendária Estrada de Ferro Madeira-Mamoré — uma das obras mais épicas do continente. Foi oficialmente fundada em <strong>2 de outubro de 1914</strong> e completa <strong>111 anos</strong> exatamente no domingo de encerramento do TOP.
                </p>
              </div>
              <div className="dp-card">
                <div className="dp-tag" style={{ background: 'var(--dp-jungle)', color: 'white' }}>Monumento · Bruno Souza</div>
                <h3 className="dp-display" style={{ marginTop: '0.6rem', fontSize: '1.35rem' }}>Em pedra e cimento</h3>
                <p style={{ marginTop: '0.5rem', color: 'var(--dp-n-700)' }}>
                  Em frente à nova rodoviária da capital ergue-se o Monumento Destemido Pioneiro: <strong>3,6 m de altura</strong>, <strong>3 toneladas</strong> de concreto armado, escultura do artista plástico <strong>Bruno Souza</strong> que captura a essência da construção da EFMM.
                </p>
              </div>
              <div className="dp-card">
                <div className="dp-tag" style={{ background: 'var(--dp-river)', color: 'white' }}>Terminal · 2024</div>
                <h3 className="dp-display" style={{ marginTop: '0.6rem', fontSize: '1.35rem' }}>O terminal que leva o mesmo nome</h3>
                <p style={{ marginTop: '0.5rem', color: 'var(--dp-n-700)' }}>
                  Em dezembro de 2024, após mais de 40 anos de espera, Porto Velho inaugurou o <strong>Terminal Rodoviário Destemidos Pioneiros</strong>. O nome não é coincidência — é o reconhecimento institucional de que pioneirismo é o DNA local.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metodologia */}
      <section id="metodologia" className="dp-section dp-onyx">
        <div className="dp-container">
          <div className="dp-eyebrow">A Metodologia</div>
          <h2 className="dp-h2" style={{ marginTop: '0.75rem', color: 'var(--dp-bone)' }}>72 horas. Uma montanha. Três pilares.</h2>
          <p className="dp-lead" style={{ color: 'var(--dp-n-300)', marginTop: '1rem' }}>
            O TOP é um processo imersivo estruturado para mover o homem em três dimensões ao mesmo tempo: <strong style={{ color: 'var(--dp-bone)' }}>físico, emocional e espiritual</strong>. Não é palestra. Não é retiro contemplativo. É travessia.
          </p>

          <div className="dp-divider" style={{ background: 'linear-gradient(to right, transparent, var(--dp-n-700), transparent)' }} />

          <div className="dp-grid" style={{ marginTop: '1rem' }}>
            {PHASES.map((p, i) => (
              <div key={p.day} className="dp-card" style={{ background: 'var(--dp-n-800)', border: '1px solid var(--dp-n-700)', color: 'var(--dp-bone)' }}>
                <div className="dp-display" style={{ fontSize: '0.95rem', color: 'var(--dp-clay)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Dia {i + 1} · {p.day}</div>
                <h3 className="dp-display" style={{ marginTop: '0.4rem', fontSize: '1.5rem' }}>{p.label}</h3>
                <p style={{ marginTop: '0.6rem', color: 'var(--dp-n-300)', fontSize: '0.95rem', lineHeight: 1.55 }}>{p.blurb}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programação */}
      <section id="programacao" className="dp-section">
        <div className="dp-container">
          <div className="dp-eyebrow">Programação</div>
          <h2 className="dp-h2" style={{ marginTop: '0.75rem' }}>02 a 05 de outubro de 2025</h2>
          <p className="dp-lead" style={{ marginTop: '1rem' }}>
            O encerramento cai justamente no <strong>domingo em que Porto Velho completa 111 anos</strong>. Coincidência simbólica que costura passado e travessia.
          </p>

          <ol style={{ listStyle: 'none', padding: 0, marginTop: '2rem', display: 'grid', gap: '1rem' }}>
            <li className="dp-card">
              <strong className="dp-display" style={{ fontSize: '1.25rem' }}>Quinta · 02/10 — Chamado</strong>
              <p style={{ color: 'var(--dp-n-700)', marginTop: '0.4rem' }}>Check-in e cadastro · Acolhida pela equipe Pioneiros Porto Velho · Cerimônia de abertura · Primeira noite em campo.</p>
            </li>
            <li className="dp-card">
              <strong className="dp-display" style={{ fontSize: '1.25rem' }}>Sexta · 03/10 — Confronto</strong>
              <p style={{ color: 'var(--dp-n-700)', marginTop: '0.4rem' }}>Despertar antes do sol · Primeiros desafios físicos da trilha · Dinâmicas de quebra e reconstrução · Roda de confissão e fraternidade · Fogo, escuta, silêncio.</p>
            </li>
            <li className="dp-card">
              <strong className="dp-display" style={{ fontSize: '1.25rem' }}>Sábado · 04/10 — Travessia</strong>
              <p style={{ color: 'var(--dp-n-700)', marginTop: '0.4rem' }}>Subida ao ponto mais alto · Provação coletiva: ninguém sobe sozinho · Cerimônia da Travessia · Vigília — a noite mais longa do TOP.</p>
            </li>
            <li className="dp-card">
              <strong className="dp-display" style={{ fontSize: '1.25rem' }}>Domingo · 05/10 — Retorno</strong>
              <p style={{ color: 'var(--dp-n-700)', marginTop: '0.4rem' }}>Descida em formação · Cerimônia de entrega de medalhas e juramento legendário · Encerramento e reencontro com as famílias · Porto Velho 111 anos.</p>
            </li>
          </ol>
        </div>
      </section>

      {/* O que levar */}
      <section id="kit" className="dp-section">
        <div className="dp-container">
          <div className="dp-eyebrow">O que levar</div>
          <h2 className="dp-h2" style={{ marginTop: '0.75rem' }}>A montanha tem regras.</h2>
          <p className="dp-lead" style={{ marginTop: '1rem' }}>
            Guia geral baseado no padrão dos TOPs. A lista oficial e definitiva é enviada pela equipe Pioneiros Porto Velho após a confirmação da inscrição.
          </p>
          <div className="dp-grid" style={{ marginTop: '2rem' }}>
            {KIT.map(k => (
              <div key={k.title} className="dp-card">
                <h3 className="dp-display" style={{ fontSize: '1.2rem', color: k.title === 'Proibido' ? 'var(--dp-blood)' : 'var(--dp-ink)' }}>{k.title}</h3>
                <p style={{ marginTop: '0.5rem', color: 'var(--dp-n-700)', lineHeight: 1.6 }}>{k.items}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inscrição */}
      <section id="inscricao" className="dp-section" style={{ background: 'white', borderTop: '1px solid var(--dp-n-200)', borderBottom: '1px solid var(--dp-n-200)' }}>
        <div className="dp-container">
          <div className="dp-eyebrow">Inscrição</div>
          <h2 className="dp-h2" style={{ marginTop: '0.75rem' }}>R$ 1.800 — R$ 1.850</h2>
          <p className="dp-lead" style={{ marginTop: '1rem' }}>
            Valor por participante, conforme lote e forma de pagamento. Inclui alimentação completa, uniforme oficial, boné do TOP 1270, material da jornada, hospedagem em campo e cobertura de equipe médica.
          </p>

          <div className="dp-grid" style={{ marginTop: '2rem' }}>
            <div className="dp-card">
              <h3 className="dp-display" style={{ fontSize: '1.2rem' }}>✓ Incluído</h3>
              <ul style={{ marginTop: '0.6rem', paddingLeft: '1.1rem', color: 'var(--dp-n-700)', lineHeight: 1.7 }}>
                <li>Alimentação nos 4 dias</li>
                <li>Uniforme oficial</li>
                <li>Boné do TOP 1270</li>
                <li>Material da jornada</li>
                <li>Hospedagem em campo</li>
                <li>Equipe médica permanente</li>
              </ul>
            </div>
            <div className="dp-card">
              <h3 className="dp-display" style={{ fontSize: '1.2rem' }}>✗ Não incluído</h3>
              <ul style={{ marginTop: '0.6rem', paddingLeft: '1.1rem', color: 'var(--dp-n-700)', lineHeight: 1.7 }}>
                <li>Deslocamento até Porto Velho</li>
                <li>Equipamento pessoal de trilha</li>
                <li>Hotel pré e pós-evento</li>
                <li>Despesas pessoais</li>
              </ul>
            </div>
            <div className="dp-card" style={{ background: 'var(--dp-ink)', color: 'var(--dp-bone)', border: 0 }}>
              <h3 className="dp-display" style={{ fontSize: '1.2rem', color: 'var(--dp-bone)' }}>TOP Warriors</h3>
              <p style={{ marginTop: '0.6rem', color: 'var(--dp-n-300)' }}>Formato para solteiros de 18 a 30 anos que ainda não tiveram união estável. Investimento reduzido a partir de <strong style={{ color: 'var(--dp-bone)' }}>R$ 1.490</strong>.</p>
            </div>
          </div>

          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a href="https://www.instagram.com/legendariosportovelho/" target="_blank" rel="noreferrer" className="dp-btn dp-btn-primary">Falar com Pioneiros PVH no Instagram</a>
            <a href="https://legendarios.org.br/" target="_blank" rel="noreferrer" className="dp-btn dp-btn-ghost">Site oficial do movimento</a>
          </div>
          <p style={{ marginTop: '1rem', color: 'var(--dp-n-500)', fontSize: '0.85rem' }}>
            As inscrições para o TOP 1270 foram processadas pelo time Pioneiros Porto Velho. Para a próxima edição ou lista de interesse, fale conosco pelos canais acima.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="dp-section">
        <div className="dp-container" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.5fr)', gap: '3rem' }}>
          <div>
            <div className="dp-eyebrow">FAQ</div>
            <h2 className="dp-h2" style={{ marginTop: '0.75rem' }}>Antes de subir, é normal duvidar.</h2>
            <p className="dp-lead" style={{ marginTop: '1rem' }}>
              Algumas das perguntas que mais chegam até a equipe do Pioneiros Porto Velho.
            </p>
          </div>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {FAQ.map(item => (
              <details key={item.q} className="dp-card" style={{ cursor: 'pointer' }}>
                <summary style={{ fontWeight: 600, fontSize: '1.05rem' }}>{item.q}</summary>
                <p style={{ marginTop: '0.6rem', color: 'var(--dp-n-700)', lineHeight: 1.6 }}>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contato / Footer */}
      <footer id="contato" className="dp-section dp-onyx" style={{ paddingTop: '4rem', paddingBottom: '3rem' }}>
        <div className="dp-container">
          <div className="dp-eyebrow">Contato</div>
          <h2 className="dp-h2" style={{ marginTop: '0.75rem', color: 'var(--dp-bone)', maxWidth: '20ch' }}>Fale com os Pioneiros de Porto Velho.</h2>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <a href="https://www.instagram.com/legendariosportovelho/" target="_blank" rel="noreferrer" className="dp-btn dp-btn-primary">Instagram @legendariosportovelho</a>
            <a href="https://legendarios.org.br/" target="_blank" rel="noreferrer" className="dp-btn dp-btn-ghost" style={{ color: 'var(--dp-bone)' }}>legendarios.org.br</a>
          </div>
          <div className="dp-divider" style={{ background: 'linear-gradient(to right, transparent, var(--dp-n-700), transparent)', marginTop: '3rem' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', color: 'var(--dp-n-400)' }}>
            <span>TOP 1270 — Destemidos Pioneiros · Porto Velho/RO · 02-05 OUT 2025</span>
            <span>Microsite construído com Antigravity Kit + design-md</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
