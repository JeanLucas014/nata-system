import React, { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from './supabaseClient';

// ── Design Tokens ──
const BLUE = '#3742fa';
const BL = '#eef0ff';
const G = {50:'#f9fafb',100:'#f3f4f6',200:'#e5e7eb',300:'#d1d5db',400:'#9ca3af',500:'#6b7280',600:'#4b5563',700:'#374151',800:'#1f2937',900:'#111827'};

// ── Auth Context ──
const AuthCtx = createContext(null);

// ── Icons ──
function Icon({name, size=20}) {
  const p = {width:size, height:size, strokeWidth:1.8, stroke:'currentColor', fill:'none', strokeLinecap:'round', strokeLinejoin:'round', viewBox:'0 0 24 24'};
  const icons = {
    dashboard:<svg {...p}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    finance:<svg {...p}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    clients:<svg {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    tasks:<svg {...p}><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
    proposals:<svg {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    calendar:<svg {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    portfolio:<svg {...p}><rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>,
    crm:<svg {...p}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    partners:<svg {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>,
    messages:<svg {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    kpi:<svg {...p}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    settings:<svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    logout:<svg {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    chevron:<svg {...p}><polyline points="9 18 15 12 9 6"/></svg>,
    search:<svg {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    bell:<svg {...p}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    plus:<svg {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    alert:<svg {...p}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  };
  return icons[name] || null;
}

// ── Nav Config ──
const NAV = [
  {s:'Principal', i:[{id:'dashboard',l:'Dashboard',ic:'dashboard'},{id:'finance',l:'Financeiro',ic:'finance'},{id:'clients',l:'Clientes',ic:'clients'},{id:'tasks',l:'Tarefas',ic:'tasks'}]},
  {s:'Comercial', i:[{id:'proposals',l:'Propostas',ic:'proposals'},{id:'crm',l:'CRM / Pipeline',ic:'crm'},{id:'partners',l:'Parceiros',ic:'partners'}]},
  {s:'Conteúdo', i:[{id:'portfolio',l:'Portfólio',ic:'portfolio'},{id:'messages',l:'Mensagens',ic:'messages'}]},
  {s:'Análise', i:[{id:'calendar',l:'Calendário',ic:'calendar'},{id:'kpi',l:'KPIs',ic:'kpi'}]},
];

const TITLES = {
  dashboard:['Dashboard','Visão geral da Nata Business'], finance:['Financeiro','Receitas, despesas e fluxo de caixa'],
  clients:['Clientes','Gestão de clientes e projetos'], tasks:['Tarefas','Demandas e acompanhamento'],
  proposals:['Propostas','Criar e gerenciar propostas'], crm:['CRM / Pipeline','Funil de vendas'],
  partners:['Parceiros','Agências parceiras'], portfolio:['Portfólio','Sites e vídeos'],
  messages:['Mensagens','Templates de WhatsApp'], calendar:['Calendário','Eventos e prazos'],
  kpi:['KPIs','Indicadores'], settings:['Configurações','Usuários, serviços e integrações'],
};

const MODULES = {
  finance:{ic:'finance',t:'Módulo Financeiro',d:'Controle de receitas, despesas, contas a pagar e lucro.',tg:['Visão anual','Mensal','Recorrências','Meta 2026','Gráficos','CSV']},
  clients:{ic:'clients',t:'Gestão de Clientes',d:'Cadastro, credenciais, arquivos, timeline e checklists automáticos.',tg:['Ficha','Credenciais','Drive','Checklists','Timeline']},
  tasks:{ic:'tasks',t:'Tarefas e Demandas',d:'Kanban com atribuição, templates e visão \'Meu dia\'.',tg:['Kanban','Atribuição','Prioridades','Templates','Prazos']},
  proposals:{ic:'proposals',t:'Propostas',d:'Templates por serviço com preços automáticos.',tg:['Templates','Preços','Status','Auto-criar cliente']},
  crm:{ic:'crm',t:'CRM / Pipeline',d:'Funil de vendas visual com follow-ups.',tg:['Funil','Follow-ups','Conversão']},
  partners:{ic:'partners',t:'Parceiros',d:'Agências parceiras com condições e relatórios.',tg:['Cadastro','Condições','Relatório']},
  portfolio:{ic:'portfolio',t:'Portfólio Dinâmico',d:'Sites e vídeos que sincronizam com o site.',tg:['Web Design','Vídeos','Sync','Upload']},
  messages:{ic:'messages',t:'Mensagens',d:'Templates de WhatsApp por etapa do projeto.',tg:['Boas-vindas','Checklist','Follow-up','Copiar']},
  calendar:{ic:'calendar',t:'Calendário',d:'Eventos com integração Google Agenda.',tg:['Mensal','Google Agenda','Prazos']},
  kpi:{ic:'kpi',t:'KPIs',d:'Ticket médio, tempo de entrega, taxa de conversão.',tg:['Ticket','Tempo','Conversão','Relatório']},
};

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
}

// ══════════════════════════════════════
//  LOGIN
// ══════════════════════════════════════
function LoginScreen() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [mode, setMode] = useState('login'); // 'login' or 'forgot'

  const handleLogin = async () => {
    if (!email || !pass) { setError('Preencha todos os campos'); return; }
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) {
      setError(error.message === 'Invalid login credentials' ? 'E-mail ou senha incorretos' : error.message);
    }
    setLoading(false);
  };

  const handleForgot = async () => {
    if (!email) { setError('Digite seu e-mail'); return; }
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    if (error) { setError(error.message); }
    else { setSuccess('E-mail de recuperação enviado! Verifique sua caixa de entrada.'); }
    setLoading(false);
  };

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#fff'}}>
      <div style={{width:400,padding:48}}>
        <div style={{marginBottom:48,textAlign:'center'}}>
          <div style={{display:'inline-flex',alignItems:'baseline'}}>
            <span style={{fontSize:36,fontWeight:800,color:'#000',letterSpacing:'-0.02em'}}>NATA</span>
            <span style={{fontSize:36,fontWeight:800,color:BLUE}}>.</span>
          </div>
          <div style={{fontSize:13,color:G[400],marginTop:4,letterSpacing:'0.08em',fontWeight:500}}>SYSTEM</div>
        </div>

        {mode === 'login' ? (
          <>
            <div style={{marginBottom:20}}>
              <label style={{display:'block',fontSize:13,fontWeight:600,color:G[700],marginBottom:6}}>E-mail</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="seu@email.com" onKeyDown={e=>e.key==='Enter'&&handleLogin()}
                style={{width:'100%',padding:'12px 14px',border:`1px solid ${G[200]}`,borderRadius:10,fontSize:14,outline:'none',fontFamily:'inherit',background:G[50],boxSizing:'border-box'}}/>
            </div>
            <div style={{marginBottom:8}}>
              <label style={{display:'block',fontSize:13,fontWeight:600,color:G[700],marginBottom:6}}>Senha</label>
              <div style={{position:'relative'}}>
                <input type={showPass?'text':'password'} value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••" onKeyDown={e=>e.key==='Enter'&&handleLogin()}
                  style={{width:'100%',padding:'12px 44px 12px 14px',border:`1px solid ${G[200]}`,borderRadius:10,fontSize:14,outline:'none',fontFamily:'inherit',background:G[50],boxSizing:'border-box'}}/>
                <button onClick={()=>setShowPass(!showPass)} type="button"
                  style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:G[400],padding:2,display:'flex'}}>
                  {showPass ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>
            <div style={{textAlign:'right',marginBottom:24}}>
              <button onClick={()=>{setMode('forgot');setError('');setSuccess('');}} style={{background:'none',border:'none',fontSize:13,color:BLUE,cursor:'pointer',fontFamily:'inherit',fontWeight:500,padding:0}}>
                Esqueci minha senha
              </button>
            </div>
            {error && <div style={{background:'#fef2f2',border:'1px solid #fecaca',color:'#dc2626',fontSize:13,padding:'10px 14px',borderRadius:8,marginBottom:16,display:'flex',alignItems:'center',gap:8}}><Icon name="alert" size={16}/>{error}</div>}
            <button onClick={handleLogin} disabled={loading}
              style={{width:'100%',padding:'13px 0',background:BLUE,color:'#fff',border:'none',borderRadius:10,fontSize:14,fontWeight:700,cursor:loading?'wait':'pointer',fontFamily:'inherit',opacity:loading?.7:1}}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </>
        ) : (
          <>
            <div style={{marginBottom:24}}>
              <label style={{display:'block',fontSize:13,fontWeight:600,color:G[700],marginBottom:6}}>E-mail</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="seu@email.com" onKeyDown={e=>e.key==='Enter'&&handleForgot()}
                style={{width:'100%',padding:'12px 14px',border:`1px solid ${G[200]}`,borderRadius:10,fontSize:14,outline:'none',fontFamily:'inherit',background:G[50],boxSizing:'border-box'}}/>
            </div>
            {error && <div style={{background:'#fef2f2',border:'1px solid #fecaca',color:'#dc2626',fontSize:13,padding:'10px 14px',borderRadius:8,marginBottom:16,display:'flex',alignItems:'center',gap:8}}><Icon name="alert" size={16}/>{error}</div>}
            {success && <div style={{background:'#f0fdf4',border:'1px solid #bbf7d0',color:'#16a34a',fontSize:13,padding:'10px 14px',borderRadius:8,marginBottom:16}}>{success}</div>}
            <button onClick={handleForgot} disabled={loading}
              style={{width:'100%',padding:'13px 0',background:BLUE,color:'#fff',border:'none',borderRadius:10,fontSize:14,fontWeight:700,cursor:loading?'wait':'pointer',fontFamily:'inherit',opacity:loading?.7:1,marginBottom:16}}>
              {loading ? 'Enviando...' : 'Enviar link de recuperação'}
            </button>
            <button onClick={()=>{setMode('login');setError('');setSuccess('');}}
              style={{width:'100%',padding:'13px 0',background:'transparent',color:G[500],border:`1px solid ${G[200]}`,borderRadius:10,fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>
              Voltar ao login
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════
//  SIDEBAR
// ══════════════════════════════════════
function Sidebar({page, setPage, profile, collapsed, setCollapsed}) {
  const handleLogout = async () => { await supabase.auth.signOut(); };

  return (
    <div style={{width:collapsed?72:260,minHeight:'100vh',background:'#fff',borderRight:`1px solid ${G[100]}`,display:'flex',flexDirection:'column',transition:'width .25s',flexShrink:0,position:'relative',zIndex:20}}>
      <div style={{display:'flex',flexDirection:'column',flex:1,overflow:'hidden'}}>
      <div style={{padding:collapsed?'20px 0':'20px 24px',display:'flex',alignItems:'center',justifyContent:collapsed?'center':'flex-start',borderBottom:`1px solid ${G[100]}`,minHeight:64}}>
        {!collapsed ? (
          <div style={{display:'flex',alignItems:'baseline'}}>
            <span style={{fontSize:22,fontWeight:800,color:'#000'}}>NATA</span>
            <span style={{fontSize:22,fontWeight:800,color:BLUE}}>.</span>
            <span style={{fontSize:11,fontWeight:500,color:G[400],marginLeft:8,letterSpacing:'.1em'}}>SYSTEM</span>
          </div>
        ) : (
          <div style={{display:'flex',alignItems:'baseline'}}>
            <span style={{fontSize:20,fontWeight:800,color:'#000'}}>N</span>
            <span style={{fontSize:20,fontWeight:800,color:BLUE}}>.</span>
          </div>
        )}
      </div>

      <div style={{flex:1,overflowY:'auto',padding:collapsed?'12px 8px':'12px'}}>
        {NAV.map(section => (
          <div key={section.s} style={{marginBottom:20}}>
            {!collapsed && <div style={{fontSize:10,fontWeight:700,color:G[400],textTransform:'uppercase',letterSpacing:'.12em',padding:'8px 12px'}}>{section.s}</div>}
            {section.i.map(item => {
              const active = page === item.id;
              return (
                <button key={item.id} onClick={()=>setPage(item.id)} title={collapsed?item.l:undefined}
                  style={{width:'100%',display:'flex',alignItems:'center',gap:12,padding:collapsed?'10px 0':'10px 12px',justifyContent:collapsed?'center':'flex-start',border:'none',borderRadius:8,cursor:'pointer',background:active?BL:'transparent',color:active?BLUE:G[600],fontSize:14,fontWeight:active?600:500,fontFamily:'inherit',transition:'all .15s',marginBottom:2}}>
                  <Icon name={item.ic} size={19}/>
                  {!collapsed && <span>{item.l}</span>}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div style={{borderTop:`1px solid ${G[100]}`,padding:collapsed?'12px 8px':'12px'}}>
        <button onClick={()=>setPage('settings')}
          style={{width:'100%',display:'flex',alignItems:'center',gap:12,padding:collapsed?'10px 0':'10px 12px',justifyContent:collapsed?'center':'flex-start',border:'none',borderRadius:8,cursor:'pointer',background:page==='settings'?BL:'transparent',color:page==='settings'?BLUE:G[500],fontSize:14,fontWeight:500,fontFamily:'inherit',marginBottom:4}}>
          <Icon name="settings" size={19}/>{!collapsed && <span>Configurações</span>}
        </button>
        <div style={{display:'flex',alignItems:'center',gap:10,padding:collapsed?'10px 0':'10px 12px',justifyContent:collapsed?'center':'flex-start'}}>
          <div style={{width:34,height:34,borderRadius:'50%',background:BLUE,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,flexShrink:0}}>
            {getInitials(profile?.full_name)}
          </div>
          {!collapsed && (
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:600,color:G[800],whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{profile?.full_name || 'Usuário'}</div>
              <div style={{fontSize:11,color:G[400]}}>{profile?.role==='admin'?'Administrador':'Membro'}</div>
            </div>
          )}
          {!collapsed && (
            <button onClick={handleLogout} title="Sair" style={{background:'none',border:'none',cursor:'pointer',color:G[400],padding:4}}>
              <Icon name="logout" size={18}/>
            </button>
          )}
        </div>
      </div>

      </div>
      <button onClick={()=>setCollapsed(!collapsed)}
        style={{position:'absolute',top:76,right:-14,width:28,height:28,borderRadius:'50%',background:'#fff',border:`1px solid ${G[200]}`,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:G[400],transform:collapsed?'rotate(0)':'rotate(180deg)',transition:'transform .25s',boxShadow:'0 1px 3px rgba(0,0,0,.08)',zIndex:30}}>
        <Icon name="chevron" size={14}/>
      </button>
    </div>
  );
}

// ══════════════════════════════════════
//  TOP BAR
// ══════════════════════════════════════
function TopBar({title, subtitle}) {
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 32px',borderBottom:`1px solid ${G[100]}`,background:'#fff'}}>
      <div>
        <h1 style={{fontSize:20,fontWeight:700,color:G[900],margin:0}}>{title}</h1>
        {subtitle && <p style={{fontSize:13,color:G[400],margin:'2px 0 0'}}>{subtitle}</p>}
      </div>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <div style={{position:'relative'}}>
          <div style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:G[400]}}><Icon name="search" size={16}/></div>
          <input placeholder="Buscar..." style={{width:200,padding:'9px 14px 9px 36px',border:`1px solid ${G[200]}`,borderRadius:10,fontSize:13,outline:'none',fontFamily:'inherit',background:G[50],boxSizing:'border-box'}}/>
        </div>
        <button style={{position:'relative',background:'none',border:'none',cursor:'pointer',color:G[500],padding:8}}>
          <Icon name="bell" size={20}/>
          <div style={{position:'absolute',top:6,right:6,width:8,height:8,borderRadius:'50%',background:'#ef4444',border:'2px solid #fff'}}/>
        </button>
        <button style={{display:'flex',alignItems:'center',gap:6,background:BLUE,color:'#fff',border:'none',borderRadius:10,padding:'9px 16px',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>
          <Icon name="plus" size={16}/>Novo
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════
//  DASHBOARD
// ══════════════════════════════════════
function Dashboard({profile}) {
  const name = profile?.full_name?.split(' ')[0] || 'Usuário';
  const cards = [
    {l:'Receita do Mês',v:'R$ 5.422',ch:'+12%',c:'#10b981'},
    {l:'Despesas',v:'R$ 486',ch:'-3%',c:'#ef4444'},
    {l:'Lucro',v:'R$ 4.936',ch:'+18%',c:'#10b981'},
    {l:'Clientes Ativos',v:'4',ch:'+2',c:'#10b981'},
  ];
  const tasks = [
    {t:'Finalizar site Arcanjo',st:'Em andamento',u:true},
    {t:'Enviar proposta Cola e Decora',st:'A fazer',u:false},
    {t:'Criar landing page de sites',st:'A fazer',u:true},
    {t:'Pedir avaliação Google',st:'A fazer',u:false},
  ];
  const cls = [
    {n:'Alice',sv:'Site',v:'R$ 1.200',st:'Ativo'},
    {n:'Impressionart',sv:'Parceiro',v:'R$ 3.425',st:'Ativo'},
    {n:'Site Arcanjo',sv:'Site WordPress',v:'R$ 795',st:'Em andamento'},
    {n:'Cola e Decora',sv:'Loja Virtual',v:'R$ 999',st:'Proposta'},
  ];

  return (
    <div style={{padding:32}}>
      <div style={{marginBottom:8}}>
        <span style={{fontSize:14,color:G[400]}}>Bom dia,</span>
        <span style={{fontSize:14,fontWeight:600,color:G[800],marginLeft:4}}>{name} 👋</span>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:32,marginTop:16}}>
        {cards.map((c,i) => (
          <div key={i} style={{background:'#fff',border:`1px solid ${G[100]}`,borderRadius:12,padding:'20px 22px'}}>
            <div style={{fontSize:12,color:G[400],fontWeight:500,marginBottom:8,textTransform:'uppercase',letterSpacing:'.06em'}}>{c.l}</div>
            <div style={{display:'flex',alignItems:'baseline',gap:10}}>
              <span style={{fontSize:24,fontWeight:700,color:G[900]}}>{c.v}</span>
              <span style={{fontSize:12,fontWeight:600,color:c.c}}>{c.ch}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
        <div style={{background:'#fff',border:`1px solid ${G[100]}`,borderRadius:12,padding:24}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
            <h3 style={{fontSize:15,fontWeight:700,color:G[800],margin:0}}>Tarefas pendentes</h3>
            <span style={{fontSize:12,color:BLUE,fontWeight:600,cursor:'pointer'}}>Ver todas →</span>
          </div>
          {tasks.map((t,i) => (
            <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 0',borderBottom:i<3?`1px solid ${G[50]}`:'none'}}>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <div style={{width:18,height:18,borderRadius:4,border:`2px solid ${G[200]}`,flexShrink:0}}/>
                <span style={{fontSize:13,color:G[700],fontWeight:500}}>{t.t}</span>
              </div>
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                {t.u && <span style={{fontSize:10,fontWeight:700,color:'#ef4444',background:'#fef2f2',padding:'3px 8px',borderRadius:4}}>URGENTE</span>}
                <span style={{fontSize:11,color:G[400]}}>{t.st}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{background:'#fff',border:`1px solid ${G[100]}`,borderRadius:12,padding:24}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
            <h3 style={{fontSize:15,fontWeight:700,color:G[800],margin:0}}>Clientes recentes</h3>
            <span style={{fontSize:12,color:BLUE,fontWeight:600,cursor:'pointer'}}>Ver todos →</span>
          </div>
          {cls.map((c,i) => (
            <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 0',borderBottom:i<3?`1px solid ${G[50]}`:'none'}}>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <div style={{width:32,height:32,borderRadius:8,background:BL,color:BLUE,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700}}>{c.n[0]}</div>
                <div><div style={{fontSize:13,fontWeight:600,color:G[800]}}>{c.n}</div><div style={{fontSize:11,color:G[400]}}>{c.sv}</div></div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:13,fontWeight:600,color:G[800]}}>{c.v}</div>
                <div style={{fontSize:11,fontWeight:500,color:c.st==='Ativo'?'#10b981':c.st==='Proposta'?'#f59e0b':BLUE}}>{c.st}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{marginTop:20,background:'#fff',border:`1px solid ${G[100]}`,borderRadius:12,padding:24}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
          <h3 style={{fontSize:15,fontWeight:700,color:G[800],margin:0}}>Meta 2026</h3>
          <span style={{fontSize:13,color:G[400]}}>R$ 17.514 / R$ 150.000</span>
        </div>
        <div style={{width:'100%',height:10,background:G[100],borderRadius:5,overflow:'hidden'}}>
          <div style={{width:`${(17514/150000)*100}%`,height:'100%',background:`linear-gradient(90deg,${BLUE},#6366f1)`,borderRadius:5}}/>
        </div>
        <div style={{fontSize:12,color:G[400],marginTop:8}}>{((17514/150000)*100).toFixed(1)}% da meta — Faltam R$ 132.486</div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════
//  SETTINGS
// ══════════════════════════════════════
function SettingsPage({profile}) {
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    supabase.from('profiles').select('*').then(({data}) => { if(data) setUsers(data); });
    supabase.from('services').select('*').then(({data}) => { if(data) setServices(data); });
  }, []);

  const tabs = [{id:'users',l:'Usuários'},{id:'services',l:'Serviços'},{id:'integrations',l:'Integrações'},{id:'export',l:'Exportação'}];
  const ints = [
    {n:'Supabase',d:'Banco de dados e autenticação',c:true},
    {n:'Google Agenda',d:'Calendário e eventos',c:false},
    {n:'Google Drive',d:'Arquivos dos clientes',c:false},
    {n:'WhatsApp Business',d:'Templates de mensagem',c:true},
    {n:'natabusiness.com.br',d:'Portfólio dinâmico',c:false},
    {n:'GitHub',d:'Versionamento',c:true},
    {n:'Vercel',d:'Deploy e hosting',c:true},
  ];

  return (
    <div style={{padding:32}}>
      <div style={{display:'flex',gap:4,marginBottom:32,background:G[50],padding:4,borderRadius:10,width:'fit-content'}}>
        {tabs.map(t => (
          <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:'9px 18px',border:'none',borderRadius:8,fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'inherit',background:tab===t.id?'#fff':'transparent',color:tab===t.id?G[800]:G[400],boxShadow:tab===t.id?'0 1px 3px rgba(0,0,0,.06)':'none'}}>{t.l}</button>
        ))}
      </div>
      {tab==='users' && (
        <div>
          <h3 style={{fontSize:16,fontWeight:700,color:G[800],margin:'0 0 24px'}}>Usuários</h3>
          {users.map(u => (
            <div key={u.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:20,background:'#fff',border:`1px solid ${G[100]}`,borderRadius:12,marginBottom:8}}>
              <div style={{display:'flex',alignItems:'center',gap:14}}>
                <div style={{width:42,height:42,borderRadius:'50%',background:BLUE,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700}}>{getInitials(u.full_name)}</div>
                <div><div style={{fontSize:14,fontWeight:600,color:G[800]}}>{u.full_name}</div><div style={{fontSize:12,color:G[400]}}>{u.email}</div></div>
              </div>
              <span style={{padding:'5px 12px',background:u.role==='admin'?BL:G[50],color:u.role==='admin'?BLUE:G[500],borderRadius:6,fontSize:12,fontWeight:600}}>{u.role==='admin'?'Administrador':'Membro'}</span>
            </div>
          ))}
        </div>
      )}
      {tab==='services' && (
        <div>
          <h3 style={{fontSize:16,fontWeight:700,color:G[800],margin:'0 0 24px'}}>Serviços e Preços</h3>
          {services.map((s,i) => (
            <div key={s.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 20px',background:i%2===0?G[50]:'#fff',borderRadius:8,marginBottom:2}}>
              <span style={{fontSize:13,color:G[700],fontWeight:500}}>{s.name}</span>
              <div style={{display:'flex',gap:24,alignItems:'center'}}>
                <span style={{fontSize:13,fontWeight:700,color:G[800]}}>R$ {Number(s.price).toLocaleString('pt-BR',{minimumFractionDigits:2})}{s.price_type==='monthly'?'/mês':''}</span>
                <span style={{fontSize:12,color:G[400],width:70,textAlign:'right'}}>{s.delivery_days?`${s.delivery_days} dias`:'Mensal'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab==='integrations' && (
        <div>
          <h3 style={{fontSize:16,fontWeight:700,color:G[800],margin:'0 0 24px'}}>Integrações</h3>
          {ints.map((int,i) => (
            <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:20,background:'#fff',border:`1px solid ${G[100]}`,borderRadius:12,marginBottom:8}}>
              <div><div style={{fontSize:14,fontWeight:600,color:G[800]}}>{int.n}</div><div style={{fontSize:12,color:G[400],marginTop:2}}>{int.d}</div></div>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <div style={{width:8,height:8,borderRadius:'50%',background:int.c?'#10b981':G[300]}}/>
                <span style={{fontSize:12,fontWeight:600,color:int.c?'#10b981':G[400]}}>{int.c?'Conectado':'Não conectado'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab==='export' && (
        <div>
          <h3 style={{fontSize:16,fontWeight:700,color:G[800],margin:'0 0 24px'}}>Exportação</h3>
          {[{l:'Exportar Financeiro',d:'CSV',ic:'finance'},{l:'Exportar Clientes',d:'Lista com dados',ic:'clients'},{l:'Relatório Mensal',d:'Resumo do mês',ic:'kpi'}].map((e,i) => (
            <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:20,background:'#fff',border:`1px solid ${G[100]}`,borderRadius:12,marginBottom:8}}>
              <div style={{display:'flex',alignItems:'center',gap:14}}>
                <div style={{width:40,height:40,borderRadius:10,background:G[50],display:'flex',alignItems:'center',justifyContent:'center',color:G[500]}}><Icon name={e.ic} size={20}/></div>
                <div><div style={{fontSize:14,fontWeight:600,color:G[800]}}>{e.l}</div><div style={{fontSize:12,color:G[400]}}>{e.d}</div></div>
              </div>
              <button style={{padding:'8px 18px',border:`1px solid ${G[200]}`,borderRadius:8,fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'inherit',background:'#fff',color:G[600]}}>Exportar</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════
//  FINANCE MODULE
// ══════════════════════════════════════
const MONTHS = ['','Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

function FinancePage() {
  const [view, setView] = useState('geral'); // 'geral' or month number
  const [transactions, setTransactions] = useState([]);
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({description:'',amount:'',type:'entrada',month:new Date().getMonth()+1,client_name:'',status:'pago'});
  const [saving, setSaving] = useState(false);
  const [caixa, setCaixa] = useState(() => {
    const saved = localStorage.getItem('nata_caixa');
    return saved ? parseFloat(saved) : 2625.01;
  });
  const [editingCaixa, setEditingCaixa] = useState(false);
  const [caixaInput, setCaixaInput] = useState('');

  const saveCaixa = () => {
    const val = parseFloat(caixaInput);
    if(!isNaN(val)) { setCaixa(val); localStorage.setItem('nata_caixa', val.toString()); }
    setEditingCaixa(false);
  };

  const loadData = async () => {
    const {data:tx} = await supabase.from('finance_transactions').select('*').eq('year',2026).order('month').order('created_at');
    const {data:gl} = await supabase.from('finance_goals').select('*').eq('year',2026).single();
    if(tx) setTransactions(tx);
    if(gl) setGoal(gl);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async () => {
    if(!form.description || !form.amount) return;
    setSaving(true);
    await supabase.from('finance_transactions').insert({
      description: form.description,
      amount: parseFloat(form.amount),
      type: form.type,
      month: parseInt(form.month),
      year: 2026,
      client_name: form.client_name || null,
      status: form.status,
    });
    setForm({description:'',amount:'',type:'entrada',month:new Date().getMonth()+1,client_name:'',status:'pago'});
    setShowForm(false);
    setSaving(false);
    loadData();
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Excluir este lançamento?')) return;
    await supabase.from('finance_transactions').delete().eq('id', id);
    loadData();
  };

  // Calculate monthly summaries
  const monthly = {};
  for(let m=1;m<=12;m++) {
    const mTx = transactions.filter(t=>t.month===m);
    monthly[m] = {
      entradas: mTx.filter(t=>t.type==='entrada').reduce((s,t)=>s+Number(t.amount),0),
      pagar: mTx.filter(t=>t.type==='pagar').reduce((s,t)=>s+Number(t.amount),0),
      saidas: mTx.filter(t=>t.type==='saida_caixa').reduce((s,t)=>s+Number(t.amount),0),
    };
    monthly[m].lucro = monthly[m].entradas - monthly[m].pagar - monthly[m].saidas;
  }

  const totalEntradas = Object.values(monthly).reduce((s,m)=>s+m.entradas,0);
  const totalPagar = Object.values(monthly).reduce((s,m)=>s+m.pagar,0);
  const totalSaidas = Object.values(monthly).reduce((s,m)=>s+m.saidas,0);
  const totalLucro = totalEntradas - totalPagar - totalSaidas;
  const targetAmount = goal ? Number(goal.target_amount) : 150000;

  const fmt = (v) => 'R$ ' + Number(v).toLocaleString('pt-BR',{minimumFractionDigits:2});

  if(loading) return <div style={{padding:32,color:G[400]}}>Carregando financeiro...</div>;

  // ── GENERAL VIEW ──
  if(view === 'geral') {
    return (
      <div style={{padding:32}}>
        {/* ADD FORM MODAL */}
        {showForm && (
          <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.4)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}} onClick={()=>setShowForm(false)}>
            <div style={{background:'#fff',borderRadius:16,padding:32,width:480,maxHeight:'80vh',overflow:'auto'}} onClick={e=>e.stopPropagation()}>
              <h3 style={{fontSize:18,fontWeight:700,color:G[900],margin:'0 0 24px'}}>Novo lançamento</h3>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
                <div>
                  <label style={{display:'block',fontSize:12,fontWeight:600,color:G[600],marginBottom:6}}>Tipo</label>
                  <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}
                    style={{width:'100%',padding:'10px 12px',border:`1px solid ${G[200]}`,borderRadius:8,fontSize:14,fontFamily:'inherit',background:'#fff'}}>
                    <option value="entrada">Entrada</option>
                    <option value="pagar">A Pagar (assinatura)</option>
                    <option value="saida_caixa">Saída Caixa</option>
                  </select>
                </div>
                <div>
                  <label style={{display:'block',fontSize:12,fontWeight:600,color:G[600],marginBottom:6}}>Mês</label>
                  <select value={form.month} onChange={e=>setForm(f=>({...f,month:e.target.value}))}
                    style={{width:'100%',padding:'10px 12px',border:`1px solid ${G[200]}`,borderRadius:8,fontSize:14,fontFamily:'inherit',background:'#fff'}}>
                    {MONTHS.slice(1).map((m,i)=><option key={i+1} value={i+1}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div style={{marginBottom:16}}>
                <label style={{display:'block',fontSize:12,fontWeight:600,color:G[600],marginBottom:6}}>Descrição</label>
                <input value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="Ex: Impressionart, iCloud, MEI..."
                  style={{width:'100%',padding:'10px 12px',border:`1px solid ${G[200]}`,borderRadius:8,fontSize:14,fontFamily:'inherit',boxSizing:'border-box'}}/>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
                <div>
                  <label style={{display:'block',fontSize:12,fontWeight:600,color:G[600],marginBottom:6}}>Valor (R$)</label>
                  <input type="number" step="0.01" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))} placeholder="0,00"
                    style={{width:'100%',padding:'10px 12px',border:`1px solid ${G[200]}`,borderRadius:8,fontSize:14,fontFamily:'inherit',boxSizing:'border-box'}}/>
                </div>
                <div>
                  <label style={{display:'block',fontSize:12,fontWeight:600,color:G[600],marginBottom:6}}>Cliente (opcional)</label>
                  <input value={form.client_name} onChange={e=>setForm(f=>({...f,client_name:e.target.value}))} placeholder="Nome do cliente"
                    style={{width:'100%',padding:'10px 12px',border:`1px solid ${G[200]}`,borderRadius:8,fontSize:14,fontFamily:'inherit',boxSizing:'border-box'}}/>
                </div>
              </div>
              <div style={{marginBottom:24}}>
                <label style={{display:'block',fontSize:12,fontWeight:600,color:G[600],marginBottom:6}}>Status</label>
                <div style={{display:'flex',gap:8}}>
                  {['pago','pendente','atrasado'].map(s=>(
                    <button key={s} onClick={()=>setForm(f=>({...f,status:s}))}
                      style={{padding:'8px 16px',borderRadius:8,border:`1px solid ${form.status===s?BLUE:G[200]}`,background:form.status===s?BL:'#fff',color:form.status===s?BLUE:G[600],fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'inherit',textTransform:'capitalize'}}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{display:'flex',gap:12,justifyContent:'flex-end'}}>
                <button onClick={()=>setShowForm(false)} style={{padding:'10px 20px',border:`1px solid ${G[200]}`,borderRadius:8,fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:'inherit',background:'#fff',color:G[600]}}>Cancelar</button>
                <button onClick={handleSave} disabled={saving} style={{padding:'10px 24px',border:'none',borderRadius:8,fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:'inherit',background:BLUE,color:'#fff',opacity:saving?.7:1}}>{saving?'Salvando...':'Salvar'}</button>
              </div>
            </div>
          </div>
        )}
        {/* Top cards */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
          <div/>
          <button onClick={()=>setShowForm(true)} style={{display:'flex',alignItems:'center',gap:6,background:BLUE,color:'#fff',border:'none',borderRadius:10,padding:'10px 20px',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>
            <Icon name="plus" size={16}/>Novo lançamento
          </button>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:16,marginBottom:32}}>
          {[
            {l:'Entradas',v:fmt(totalEntradas),c:'#10b981'},
            {l:'A Pagar',v:fmt(totalPagar),c:'#f59e0b'},
            {l:'Saídas',v:fmt(totalSaidas),c:'#ef4444'},
            {l:'Lucro',v:fmt(totalLucro),c:totalLucro>=0?'#10b981':'#ef4444'},
          ].map((c,i)=>(
            <div key={i} style={{background:'#fff',border:`1px solid ${G[100]}`,borderRadius:12,padding:'20px 22px'}}>
              <div style={{fontSize:12,color:G[400],fontWeight:500,marginBottom:8,textTransform:'uppercase',letterSpacing:'.06em'}}>{c.l}</div>
              <span style={{fontSize:22,fontWeight:700,color:c.c}}>{c.v}</span>
            </div>
          ))}
          {/* Caixa editável */}
          <div style={{background:'#fff',border:`1px solid ${BLUE}`,borderRadius:12,padding:'20px 22px',cursor:'pointer'}} onClick={()=>{if(!editingCaixa){setEditingCaixa(true);setCaixaInput(caixa.toString());}}}>
            <div style={{fontSize:12,color:BLUE,fontWeight:600,marginBottom:8,textTransform:'uppercase',letterSpacing:'.06em',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              Caixa
              <span style={{fontSize:10,color:G[400],fontWeight:400,textTransform:'none'}}>clique pra editar</span>
            </div>
            {editingCaixa ? (
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                <input autoFocus type="number" step="0.01" value={caixaInput} onChange={e=>setCaixaInput(e.target.value)}
                  onKeyDown={e=>{if(e.key==='Enter')saveCaixa();if(e.key==='Escape')setEditingCaixa(false);}}
                  onClick={e=>e.stopPropagation()}
                  style={{width:'100%',padding:'6px 8px',border:`1px solid ${BLUE}`,borderRadius:6,fontSize:18,fontWeight:700,fontFamily:'inherit',boxSizing:'border-box',outline:'none'}}/>
                <button onClick={e=>{e.stopPropagation();saveCaixa();}} style={{background:BLUE,color:'#fff',border:'none',borderRadius:6,padding:'6px 12px',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'inherit',whiteSpace:'nowrap'}}>OK</button>
              </div>
            ) : (
              <span style={{fontSize:22,fontWeight:700,color:BLUE}}>{fmt(caixa)}</span>
            )}
          </div>
        </div>

        {/* Meta bar */}
        <div style={{background:'#fff',border:`1px solid ${G[100]}`,borderRadius:12,padding:20,marginBottom:32}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
            <span style={{fontSize:14,fontWeight:700,color:G[800]}}>Meta 2026</span>
            <span style={{fontSize:13,color:G[400]}}>{fmt(totalEntradas)} / {fmt(targetAmount)}</span>
          </div>
          <div style={{width:'100%',height:10,background:G[100],borderRadius:5,overflow:'hidden'}}>
            <div style={{width:`${Math.min((totalEntradas/targetAmount)*100,100)}%`,height:'100%',background:`linear-gradient(90deg,${BLUE},#6366f1)`,borderRadius:5}}/>
          </div>
          <div style={{fontSize:12,color:G[400],marginTop:8}}>{((totalEntradas/targetAmount)*100).toFixed(1)}% — Faltam {fmt(Math.max(targetAmount-totalEntradas,0))}</div>
        </div>

        {/* Monthly table */}
        <div style={{background:'#fff',border:`1px solid ${G[100]}`,borderRadius:12,overflow:'hidden'}}>
          <div style={{padding:'16px 20px',borderBottom:`1px solid ${G[100]}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <h3 style={{fontSize:15,fontWeight:700,color:G[800],margin:0}}>Visão Anual — 2026</h3>
          </div>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
            <thead>
              <tr style={{background:G[50]}}>
                <th style={{padding:'12px 20px',textAlign:'left',fontWeight:700,color:G[600],fontSize:12,textTransform:'uppercase',letterSpacing:'.05em'}}>Mês</th>
                <th style={{padding:'12px 20px',textAlign:'right',fontWeight:700,color:'#10b981',fontSize:12}}>Entradas</th>
                <th style={{padding:'12px 20px',textAlign:'right',fontWeight:700,color:'#f59e0b',fontSize:12}}>A Pagar</th>
                <th style={{padding:'12px 20px',textAlign:'right',fontWeight:700,color:'#ef4444',fontSize:12}}>Saídas</th>
                <th style={{padding:'12px 20px',textAlign:'right',fontWeight:700,color:BLUE,fontSize:12}}>Lucro</th>
                <th style={{padding:'12px 20px',textAlign:'center',fontSize:12}}></th>
              </tr>
            </thead>
            <tbody>
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => {
                const d = monthly[m];
                const hasData = d.entradas>0 || d.pagar>0 || d.saidas>0;
                return (
                  <tr key={m} style={{borderBottom:`1px solid ${G[50]}`,background:hasData?'#fff':'transparent',opacity:hasData?1:0.4}}>
                    <td style={{padding:'14px 20px',fontWeight:600,color:G[800]}}>{MONTHS[m]}</td>
                    <td style={{padding:'14px 20px',textAlign:'right',color:'#10b981',fontWeight:500}}>{d.entradas>0?fmt(d.entradas):'-'}</td>
                    <td style={{padding:'14px 20px',textAlign:'right',color:'#f59e0b',fontWeight:500}}>{d.pagar>0?fmt(d.pagar):'-'}</td>
                    <td style={{padding:'14px 20px',textAlign:'right',color:'#ef4444',fontWeight:500}}>{d.saidas>0?fmt(d.saidas):'-'}</td>
                    <td style={{padding:'14px 20px',textAlign:'right',fontWeight:700,color:d.lucro>=0?'#10b981':'#ef4444'}}>{hasData?fmt(d.lucro):'-'}</td>
                    <td style={{padding:'14px 20px',textAlign:'center'}}>
                      {hasData && <button onClick={()=>setView(m)} style={{background:BL,border:'none',borderRadius:6,padding:'6px 12px',fontSize:12,fontWeight:600,color:BLUE,cursor:'pointer',fontFamily:'inherit'}}>Detalhar</button>}
                    </td>
                  </tr>
                );
              })}
              <tr style={{background:G[50],fontWeight:700}}>
                <td style={{padding:'14px 20px',color:G[900]}}>TOTAL</td>
                <td style={{padding:'14px 20px',textAlign:'right',color:'#10b981'}}>{fmt(totalEntradas)}</td>
                <td style={{padding:'14px 20px',textAlign:'right',color:'#f59e0b'}}>{fmt(totalPagar)}</td>
                <td style={{padding:'14px 20px',textAlign:'right',color:'#ef4444'}}>{fmt(totalSaidas)}</td>
                <td style={{padding:'14px 20px',textAlign:'right',color:totalLucro>=0?'#10b981':'#ef4444'}}>{fmt(totalLucro)}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ── MONTH DETAIL VIEW ──
  const mNum = parseInt(view);
  const mTx = transactions.filter(t=>t.month===mNum);
  const mEntradas = mTx.filter(t=>t.type==='entrada');
  const mPagar = mTx.filter(t=>t.type==='pagar');
  const mSaidas = mTx.filter(t=>t.type==='saida_caixa');
  const mData = monthly[mNum];

  const TxRow = ({tx, color}) => (
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 0',borderBottom:`1px solid ${G[50]}`}}>
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <span style={{fontSize:13,fontWeight:500,color:G[700]}}>{tx.description}</span>
        {tx.client_name && <span style={{fontSize:11,color:G[400],background:G[50],padding:'2px 8px',borderRadius:4}}>{tx.client_name}</span>}
        {tx.status==='pendente' && <span style={{fontSize:10,fontWeight:700,color:'#f59e0b',background:'#fffbeb',padding:'2px 8px',borderRadius:4}}>PENDENTE</span>}
        {tx.status==='atrasado' && <span style={{fontSize:10,fontWeight:700,color:'#ef4444',background:'#fef2f2',padding:'2px 8px',borderRadius:4}}>ATRASADO</span>}
      </div>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <span style={{fontSize:13,fontWeight:600,color}}>{fmt(tx.amount)}</span>
        <button onClick={()=>handleDelete(tx.id)} style={{background:'none',border:'none',cursor:'pointer',color:G[300],fontSize:16,padding:4}} title="Excluir">×</button>
      </div>
    </div>
  );

  return (
    <div style={{padding:32}}>
      {showForm && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.4)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}} onClick={()=>setShowForm(false)}>
          <div style={{background:'#fff',borderRadius:16,padding:32,width:480,maxHeight:'80vh',overflow:'auto'}} onClick={e=>e.stopPropagation()}>
            <h3 style={{fontSize:18,fontWeight:700,color:G[900],margin:'0 0 24px'}}>Novo lançamento — {MONTHS[mNum]}</h3>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
              <div>
                <label style={{display:'block',fontSize:12,fontWeight:600,color:G[600],marginBottom:6}}>Tipo</label>
                <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}
                  style={{width:'100%',padding:'10px 12px',border:`1px solid ${G[200]}`,borderRadius:8,fontSize:14,fontFamily:'inherit',background:'#fff'}}>
                  <option value="entrada">Entrada</option>
                  <option value="pagar">A Pagar</option>
                  <option value="saida_caixa">Saída Caixa</option>
                </select>
              </div>
              <div>
                <label style={{display:'block',fontSize:12,fontWeight:600,color:G[600],marginBottom:6}}>Mês</label>
                <select value={form.month} onChange={e=>setForm(f=>({...f,month:e.target.value}))}
                  style={{width:'100%',padding:'10px 12px',border:`1px solid ${G[200]}`,borderRadius:8,fontSize:14,fontFamily:'inherit',background:'#fff'}}>
                  {MONTHS.slice(1).map((m,i)=><option key={i+1} value={i+1}>{m}</option>)}
                </select>
              </div>
            </div>
            <div style={{marginBottom:16}}>
              <label style={{display:'block',fontSize:12,fontWeight:600,color:G[600],marginBottom:6}}>Descrição</label>
              <input value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="Ex: Impressionart, iCloud..."
                style={{width:'100%',padding:'10px 12px',border:`1px solid ${G[200]}`,borderRadius:8,fontSize:14,fontFamily:'inherit',boxSizing:'border-box'}}/>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
              <div>
                <label style={{display:'block',fontSize:12,fontWeight:600,color:G[600],marginBottom:6}}>Valor (R$)</label>
                <input type="number" step="0.01" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))} placeholder="0,00"
                  style={{width:'100%',padding:'10px 12px',border:`1px solid ${G[200]}`,borderRadius:8,fontSize:14,fontFamily:'inherit',boxSizing:'border-box'}}/>
              </div>
              <div>
                <label style={{display:'block',fontSize:12,fontWeight:600,color:G[600],marginBottom:6}}>Cliente (opcional)</label>
                <input value={form.client_name} onChange={e=>setForm(f=>({...f,client_name:e.target.value}))} placeholder="Nome do cliente"
                  style={{width:'100%',padding:'10px 12px',border:`1px solid ${G[200]}`,borderRadius:8,fontSize:14,fontFamily:'inherit',boxSizing:'border-box'}}/>
              </div>
            </div>
            <div style={{display:'flex',gap:12,justifyContent:'flex-end'}}>
              <button onClick={()=>setShowForm(false)} style={{padding:'10px 20px',border:`1px solid ${G[200]}`,borderRadius:8,fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:'inherit',background:'#fff',color:G[600]}}>Cancelar</button>
              <button onClick={handleSave} disabled={saving} style={{padding:'10px 24px',border:'none',borderRadius:8,fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:'inherit',background:BLUE,color:'#fff',opacity:saving?.7:1}}>{saving?'Salvando...':'Salvar'}</button>
            </div>
          </div>
        </div>
      )}
      <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:24}}>
        <button onClick={()=>setView('geral')} style={{background:G[50],border:`1px solid ${G[200]}`,borderRadius:8,padding:'8px 16px',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'inherit',color:G[600]}}>← Voltar</button>
        <h2 style={{fontSize:18,fontWeight:700,color:G[900],margin:0}}>{MONTHS[mNum]} 2026</h2>
        <button onClick={()=>setShowForm(true)} style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:6,background:BLUE,color:'#fff',border:'none',borderRadius:10,padding:'10px 20px',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>
          <Icon name="plus" size={16}/>Novo lançamento
        </button>
      </div>

      {/* Summary cards */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:32}}>
        {[
          {l:'Entradas',v:fmt(mData.entradas),c:'#10b981'},
          {l:'A Pagar',v:fmt(mData.pagar),c:'#f59e0b'},
          {l:'Saídas Caixa',v:fmt(mData.saidas),c:'#ef4444'},
          {l:'Resumo',v:fmt(mData.lucro),c:mData.lucro>=0?'#10b981':'#ef4444'},
        ].map((c,i)=>(
          <div key={i} style={{background:'#fff',border:`1px solid ${G[100]}`,borderRadius:12,padding:'20px 22px'}}>
            <div style={{fontSize:12,color:G[400],fontWeight:500,marginBottom:8,textTransform:'uppercase',letterSpacing:'.06em'}}>{c.l}</div>
            <span style={{fontSize:22,fontWeight:700,color:c.c}}>{c.v}</span>
          </div>
        ))}
      </div>

      {/* Three columns like the spreadsheet */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:16}}>
        {/* Entradas */}
        <div style={{background:'#fff',border:`1px solid ${G[100]}`,borderRadius:12,padding:20}}>
          <div style={{fontSize:13,fontWeight:700,color:'#10b981',marginBottom:16,textTransform:'uppercase',letterSpacing:'.06em'}}>Entradas</div>
          {mEntradas.length===0 ? <div style={{fontSize:13,color:G[400]}}>Nenhuma entrada</div> :
            mEntradas.map(tx=><TxRow key={tx.id} tx={tx} color="#10b981"/>)}
          <div style={{marginTop:12,paddingTop:12,borderTop:`2px solid ${G[100]}`,display:'flex',justifyContent:'space-between'}}>
            <span style={{fontSize:13,fontWeight:700,color:G[800]}}>Total</span>
            <span style={{fontSize:13,fontWeight:700,color:'#10b981'}}>{fmt(mData.entradas)}</span>
          </div>
        </div>
        {/* A Pagar */}
        <div style={{background:'#fff',border:`1px solid ${G[100]}`,borderRadius:12,padding:20}}>
          <div style={{fontSize:13,fontWeight:700,color:'#f59e0b',marginBottom:16,textTransform:'uppercase',letterSpacing:'.06em'}}>A Pagar</div>
          {mPagar.length===0 ? <div style={{fontSize:13,color:G[400]}}>Nenhuma despesa</div> :
            mPagar.map(tx=><TxRow key={tx.id} tx={tx} color="#f59e0b"/>)}
          <div style={{marginTop:12,paddingTop:12,borderTop:`2px solid ${G[100]}`,display:'flex',justifyContent:'space-between'}}>
            <span style={{fontSize:13,fontWeight:700,color:G[800]}}>Total</span>
            <span style={{fontSize:13,fontWeight:700,color:'#f59e0b'}}>{fmt(mData.pagar)}</span>
          </div>
        </div>
        {/* Saídas Caixa */}
        <div style={{background:'#fff',border:`1px solid ${G[100]}`,borderRadius:12,padding:20}}>
          <div style={{fontSize:13,fontWeight:700,color:'#ef4444',marginBottom:16,textTransform:'uppercase',letterSpacing:'.06em'}}>Saídas Caixa</div>
          {mSaidas.length===0 ? <div style={{fontSize:13,color:G[400]}}>Nenhuma saída</div> :
            mSaidas.map(tx=><TxRow key={tx.id} tx={tx} color="#ef4444"/>)}
          <div style={{marginTop:12,paddingTop:12,borderTop:`2px solid ${G[100]}`,display:'flex',justifyContent:'space-between'}}>
            <span style={{fontSize:13,fontWeight:700,color:G[800]}}>Total</span>
            <span style={{fontSize:13,fontWeight:700,color:'#ef4444'}}>{fmt(mData.saidas)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Placeholder ──
function Placeholder({ic,t,d,tg}) {
  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'60vh',textAlign:'center',padding:48}}>
      <div style={{width:64,height:64,borderRadius:16,background:BL,display:'flex',alignItems:'center',justifyContent:'center',color:BLUE,marginBottom:20}}><Icon name={ic} size={28}/></div>
      <h2 style={{fontSize:22,fontWeight:700,color:G[900],margin:'0 0 8px'}}>{t}</h2>
      <p style={{fontSize:14,color:G[400],maxWidth:400,lineHeight:1.6,margin:'0 0 24px'}}>{d}</p>
      <div style={{display:'flex',flexWrap:'wrap',gap:8,justifyContent:'center'}}>
        {tg.map((tag,i) => <span key={i} style={{padding:'6px 14px',background:G[50],border:`1px solid ${G[100]}`,borderRadius:20,fontSize:12,color:G[600],fontWeight:500}}>{tag}</span>)}
      </div>
      <div style={{marginTop:32,padding:'10px 20px',background:G[50],borderRadius:8,border:`1px solid ${G[100]}`,fontSize:12,color:G[400]}}>🚧 Módulo em desenvolvimento — Próxima sprint</div>
    </div>
  );
}

// ══════════════════════════════════════
//  MAIN APP
// ══════════════════════════════════════
export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [page, setPage] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({data:{session}}) => {
      setSession(session);
      if (session) {
        supabase.from('profiles').select('*').eq('id', session.user.id).single()
          .then(({data}) => { setProfile(data); setLoading(false); });
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {data:{subscription}} = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        supabase.from('profiles').select('*').eq('id', session.user.id).single()
          .then(({data}) => { setProfile(data); setLoading(false); });
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#fff'}}>
        <div style={{textAlign:'center'}}>
          <div style={{display:'inline-flex',alignItems:'baseline'}}>
            <span style={{fontSize:28,fontWeight:800,color:'#000'}}>NATA</span>
            <span style={{fontSize:28,fontWeight:800,color:BLUE}}>.</span>
          </div>
          <div style={{fontSize:13,color:G[400],marginTop:8}}>Carregando...</div>
        </div>
      </div>
    );
  }

  if (!session) return <LoginScreen/>;

  const t = TITLES[page] || ['',''];

  return (
    <AuthCtx.Provider value={{session, profile}}>
      <div style={{display:'flex',minHeight:'100vh',fontFamily:"'Manrope',sans-serif",background:G[50]}}>
        <Sidebar page={page} setPage={setPage} profile={profile} collapsed={collapsed} setCollapsed={setCollapsed}/>
        <div style={{flex:1,display:'flex',flexDirection:'column',minWidth:0}}>
          <TopBar title={t[0]} subtitle={t[1]}/>
          <div style={{flex:1,overflowY:'auto'}}>
            {page==='dashboard' && <Dashboard profile={profile}/>}
            {page==='finance' && <FinancePage/>}
            {page==='settings' && <SettingsPage profile={profile}/>}
            {MODULES[page] && page!=='finance' && <Placeholder {...MODULES[page]}/>}
          </div>
        </div>
      </div>
    </AuthCtx.Provider>
  );
}
