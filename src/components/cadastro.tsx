"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { dadosIniciais, dataLocalISO, preferenciasDeCompra, validarCadastro, type CampoCadastro, type DadosCadastro, type ErrosCadastro } from "@/lib/cadastro";
import { Icon } from "./icon";

gsap.registerPlugin(useGSAP);

type Dialogo = "ajuda" | "privacidade" | "limpar" | "como-funciona" | null;
const nomesCampos: Record<CampoCadastro, string> = { nome: "Nome completo", email: "E-mail", data: "Data de nascimento", tipo: "Preferência de compra" };

function Marca() {
    return (
        <span className="brand" aria-label="PortalMix">
            <span className="brand-symbol brand-market" aria-hidden="true"><Icon name="basket" size={25} /></span>
            <span className="brand-wordmark">portal<span className="font-semibold">mix</span><span className="brand-dot">.</span><small>SUPERMERCADO</small></span>
        </span>
    );
}

function Campo({ id, label, hint, error, optional, children }: {
    id: CampoCadastro; label: string; hint?: string; error?: string; optional?: boolean; children: ReactNode;
}) {
    return (
        <div className="field">
            <label htmlFor={id}>{label}{optional && <span className="optional">Opcional</span>}</label>
            {children}
            <p id={`${id}-hint`} className="field-hint">{hint}</p>
            {error && <p id={`${id}-error`} className="field-error"><Icon name="alert" size={15} />{error}</p>}
        </div>
    );
}

export function Cadastro() {
    const [dados, setDados] = useState<DadosCadastro>({ ...dadosIniciais });
    const [erros, setErros] = useState<ErrosCadastro>({});
    const [tocados, setTocados] = useState<Partial<Record<CampoCadastro, boolean>>>({});
    const [etapa, setEtapa] = useState(1);
    const [tentouEnviar, setTentouEnviar] = useState(false);
    const [dialogo, setDialogo] = useState<Dialogo>(null);
    const [aviso, setAviso] = useState("");
    const root = useRef<HTMLDivElement>(null);
    const modal = useRef<HTMLDialogElement>(null);
    const heading = useRef<HTMLHeadingElement>(null);
    const resumo = useRef<HTMLDivElement>(null);
    const mudouEtapa = useRef(false);
    const travaConclusao = useRef(false);

    useEffect(() => {
        if (dialogo && !modal.current?.open) modal.current?.showModal();
        if (!dialogo && modal.current?.open) modal.current.close();
    }, [dialogo]);

    useEffect(() => {
        if (mudouEtapa.current) heading.current?.focus();
        mudouEtapa.current = true;
    }, [etapa]);

    useEffect(() => {
        if (etapa === 3 || !Object.values(dados).some(Boolean)) return;
        const proteger = (event: BeforeUnloadEvent) => { event.preventDefault(); };
        window.addEventListener("beforeunload", proteger);
        return () => window.removeEventListener("beforeunload", proteger);
    }, [dados, etapa]);

    useGSAP(() => {
        const media = gsap.matchMedia();
        media.add("(prefers-reduced-motion: no-preference)", () => {
            gsap.timeline({ defaults: { ease: "power2.out", duration: 0.55 } })
                .from(".intro-reveal", { y: 18, opacity: 0, stagger: 0.07 })
                .from(".registration-card", { y: 20, opacity: 0 }, "<0.12")
                .from(".visual-card", { y: 10, rotation: -3, opacity: 0 }, "<0.1");
        });
        return () => media.revert();
    }, { scope: root });

    useGSAP(() => {
        const media = gsap.matchMedia();
        media.add("(prefers-reduced-motion: no-preference)", () => {
            gsap.fromTo(".step-content", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" });
        });
        return () => media.revert();
    }, { scope: root, dependencies: [etapa], revertOnUpdate: true });

    const possuiDados = Object.values(dados).some(Boolean);
    const errosAtuais = Object.entries(erros) as [CampoCadastro, string][];

    function atualizar(campo: CampoCadastro, valor: string) {
        const novos = { ...dados, [campo]: valor };
        setDados(novos);
        setAviso("");
        if (tocados[campo] || tentouEnviar) {
            setErros((anterior) => ({ ...anterior, [campo]: validarCadastro(novos)[campo] }));
        }
    }

    function validarCampo(campo: CampoCadastro) {
        setTocados((anterior) => ({ ...anterior, [campo]: true }));
        setErros((anterior) => ({ ...anterior, [campo]: validarCadastro(dados)[campo] }));
    }

    function revisar(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const encontrados = validarCadastro(dados);
        setErros(encontrados);
        setTentouEnviar(true);
        if (Object.keys(encontrados).length) {
            requestAnimationFrame(() => resumo.current?.focus());
            return;
        }
        setDados((anterior) => ({ ...anterior, nome: anterior.nome.trim(), email: anterior.email.trim() }));
        setAviso("");
        setEtapa(2);
    }

    function limpar() {
        setDados({ ...dadosIniciais });
        setErros({});
        setTocados({});
        setTentouEnviar(false);
        travaConclusao.current = false;
        setDialogo(null);
        setEtapa(1);
        setAviso("Formulário limpo. Você pode começar novamente.");
        requestAnimationFrame(() => document.getElementById("nome")?.focus());
    }

    function propriedades(campo: CampoCadastro) {
        return {
            id: campo,
            name: campo,
            value: dados[campo],
            "aria-invalid": Boolean(erros[campo]),
            "aria-describedby": `${campo}-hint${erros[campo] ? ` ${campo}-error` : ""}`,
            onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => atualizar(campo, event.target.value),
            onBlur: () => validarCampo(campo),
        };
    }

    const titulosDialogos = {
        ajuda: "Como podemos ajudar?",
        privacidade: "Seus dados, com transparência",
        limpar: "Limpar os dados preenchidos?",
        "como-funciona": "Um cadastro no seu ritmo",
    };

    return (
        <div ref={root} className="site-shell">
            <a href="#cadastro" className="skip-link">Pular para o cadastro</a>
            <header className="site-header">
                <div className="header-inner">
                    <Marca />
                    <nav aria-label="Navegação principal" className="flex items-center gap-2 sm:gap-7">
                        <a href="#cadastro" aria-current="page" className="nav-active">Cadastro<span /></a>
                        <button type="button" onClick={() => setDialogo("como-funciona")} className="nav-link hidden sm:inline-flex">Como funciona</button>
                        <span className="nav-divider hidden sm:block" />
                        <button type="button" onClick={() => setDialogo("ajuda")} className="help-button" aria-label="Precisa de ajuda?"><Icon name="help" size={18} /><span>Precisa de ajuda?</span></button>
                    </nav>
                </div>
            </header>

            <main className="page-main">
                <div className="breadcrumb" aria-label="Localização"><span>PortalMix</span><Icon name="chevron" size={13} /><span className="text-ink">Cadastro</span></div>
                <div className="main-layout">
                    <section className="intro" aria-labelledby="welcome-heading">
                        <div className="eyebrow intro-reveal"><span className="eyebrow-dot" /> FRESQUINHO PARA O SEU DIA.</div>
                        <h1 id="welcome-heading" className="intro-reveal">Seu mercado.<br />{" "}Do seu<br />{" "}<span>jeito.</span><svg className="heading-mark" viewBox="0 0 170 12" fill="none" aria-hidden="true"><path d="M3 8C50 1 111 1 165 5" stroke="currentColor" strokeWidth="5" strokeLinecap="round" /></svg></h1>
                        <p className="intro-description intro-reveal">Cadastre-se no PortalMix e deixe suas<br className="hidden lg:block" /> próximas compras mais práticas.<br className="hidden lg:block" /> Seu supermercado, mais perto de você.</p>
                        <div className="intro-benefits intro-reveal">
                            <div><span className="benefit-icon"><Icon name="clock" size={17} /></span><span>Cadastro rápido e sem custo.</span></div>
                            <div><span className="benefit-icon"><Icon name="basket" size={17} /></span><span>Você escolhe como quer comprar.</span></div>
                        </div>

                        <div className="portal-visual intro-reveal" aria-hidden="true">
                            <div className="orbit orbit-one" /><div className="orbit orbit-two" />
                            <span className="visual-spark"><Icon name="spark" size={29} /></span>
                            <div className="visual-card">
                                <span className="visual-card-label">SEU PRÓXIMO CARRINHO</span>
                                <div className="visual-person"><span className="visual-avatar"><Icon name="basket" size={26} /></span><span><strong>Boas compras começam aqui</strong><small>Mais praticidade para o seu dia.</small></span></div>
                                <div className="visual-card-line" /><div className="visual-card-line short" />
                                <span className="visual-pill"><span />Do mercado para a sua rotina</span>
                            </div>
                            <span className="floating-check"><Icon name="check" size={22} /></span>
                            <span className="visual-dot dot-one" /><span className="visual-dot dot-two" />
                        </div>
                        <div className="demo-note intro-reveal"><Icon name="info" size={16} /><p>Esta é uma demonstração acadêmica.<br />Nenhuma conta real será criada.</p></div>
                    </section>

                    <section id="cadastro" aria-labelledby="form-heading" className="registration-card scroll-mt-6">
                        <div className="card-topline"><span className="section-kicker"><Icon name="user" size={16} /> SEU CADASTRO</span><span className="step-count">Etapa {etapa} de 3</span></div>
                        <ol className="stepper" aria-label="Etapas do cadastro">
                            {["Seus dados", "Revisão", "Conclusão"].map((nome, index) => (
                                <li key={nome} className={`${etapa === index + 1 ? "current" : ""} ${etapa > index + 1 ? "complete" : ""}`} aria-current={etapa === index + 1 ? "step" : undefined}>
                                    <span className="step-number">{etapa > index + 1 ? <Icon name="check" size={14} /> : index + 1}</span><span>{nome}</span>
                                </li>
                            ))}
                        </ol>

                        <div key={etapa} className="step-content">
                            <div className="form-heading-block">
                                <h2 id="form-heading" ref={heading} tabIndex={-1}>{etapa === 1 ? "Seu cadastro, sem complicação." : etapa === 2 ? "Está tudo certinho?" : "Tudo certo por aqui!"}</h2>
                                <p>{etapa === 1 ? "Preencha seus dados e suas preferências de compra." : etapa === 2 ? "Confira seus dados. Você ainda pode editar." : "Você concluiu a demonstração de cadastro."}</p>
                            </div>

                            {etapa === 1 && (
                                <form onSubmit={revisar} noValidate>
                                    <p className="required-note">Todos os campos são obrigatórios, exceto os indicados como opcionais.</p>
                                    {tentouEnviar && errosAtuais.some(([, erro]) => erro) && (
                                        <div ref={resumo} tabIndex={-1} role="alert" className="error-summary">
                                            <strong>Confira os campos abaixo para continuar.</strong>
                                            <ul>{errosAtuais.filter(([, erro]) => erro).map(([campo, erro]) => <li key={campo}><a href={`#${campo}`} onClick={(event) => { event.preventDefault(); document.getElementById(campo)?.focus(); }}>{nomesCampos[campo]}: {erro}</a></li>)}</ul>
                                        </div>
                                    )}
                                    <Campo id="nome" label="Nome completo" hint="Como você gostaria de ser chamado?" error={erros.nome}>
                                        <input {...propriedades("nome")} type="text" autoComplete="name" placeholder="Digite seu nome completo" maxLength={100} required />
                                    </Campo>
                                    <Campo id="email" label="E-mail" hint="Use um endereço de e-mail válido." error={erros.email}>
                                        <input {...propriedades("email")} type="email" inputMode="email" autoComplete="email" placeholder="voce@exemplo.com" maxLength={254} spellCheck={false} autoCapitalize="none" required />
                                    </Campo>
                                    <div className="field-row">
                                        <Campo id="data" label="Data de nascimento" hint="Informe somente se quiser." error={erros.data} optional>
                                            <input {...propriedades("data")} type="date" autoComplete="bday" onFocus={(event) => { event.currentTarget.max = dataLocalISO(new Date()); }} />
                                        </Campo>
                                        <Campo id="tipo" label="Preferência de compra" hint="Selecione como prefere comprar." error={erros.tipo}>
                                            <select {...propriedades("tipo")} required><option value="">Selecione uma opção</option>{Object.entries(preferenciasDeCompra).map(([valor, nome]) => <option key={valor} value={valor}>{nome}</option>)}</select>
                                        </Campo>
                                    </div>
                                    <label className="newsletter"><input type="checkbox" checked={dados.novidades} onChange={(event) => setDados((anterior) => ({ ...anterior, novidades: event.target.checked }))} /><span>Quero receber ofertas e novidades do PortalMix.<small>Opcional. Você decide se quer participar.</small></span></label>
                                    <div className="form-actions"><button type="button" className="button-ghost" disabled={!possuiDados} onClick={() => setDialogo("limpar")}>Limpar dados</button><button type="submit" className="button-primary">Revisar cadastro<Icon name="arrow" size={18} /></button></div>
                                    <p className="next-step-note">Você poderá revisar tudo antes de concluir.</p>
                                </form>
                            )}

                            {etapa === 2 && (
                                <div>
                                    <dl className="review-list">
                                        <div><dt>Nome completo</dt><dd>{dados.nome}</dd></div>
                                        <div><dt>E-mail</dt><dd>{dados.email}</dd></div>
                                        <div><dt>Data de nascimento</dt><dd>{dados.data ? dados.data.split("-").reverse().join("/") : "Não informada"}</dd></div>
                                        <div><dt>Preferência de compra</dt><dd>{preferenciasDeCompra[dados.tipo]}</dd></div>
                                        <div><dt>Receber ofertas</dt><dd>{dados.novidades ? "Sim, desejo receber" : "Não, obrigado"}</dd></div>
                                    </dl>
                                    <div className="inline-notice"><Icon name="info" size={19} /><p>Este é um exercício de usabilidade. Ao concluir, seus dados não serão enviados nem salvos.</p></div>
                                    <div className="form-actions"><button type="button" className="button-ghost" onClick={() => setEtapa(1)}><Icon name="back" size={17} />Editar dados</button><button type="button" className="button-primary" onClick={() => { if (travaConclusao.current) return; travaConclusao.current = true; setEtapa(3); }}>Concluir simulação<Icon name="check" size={18} /></button></div>
                                </div>
                            )}

                            {etapa === 3 && (
                                <div className="success-content">
                                    <span className="success-icon"><Icon name="check" size={34} /></span>
                                    <h3>Pronto, {dados.nome.split(" ")[0]}.</h3>
                                    <p>Do primeiro passo à confirmação,<br />simples como deve ser.</p>
                                    <div className="inline-notice text-left"><Icon name="shield" size={20} /><p>Nenhuma conta foi criada e nenhum e-mail foi enviado. Seus dados permanecem apenas nesta página até você sair ou reiniciar.</p></div>
                                    <button type="button" className="button-primary w-full justify-center" onClick={limpar}>Começar um novo cadastro<Icon name="arrow" size={18} /></button>
                                </div>
                            )}
                        </div>

                        <div className="card-privacy"><Icon name="lock" size={14} /><span>Seus dados ficam só nesta demonstração.</span><button type="button" onClick={() => setDialogo("privacidade")}>Saiba mais</button></div>
                    </section>
                </div>

                <div className="bottom-help"><span className="bottom-help-icon"><Icon name="help" size={20} /></span><p>Uma dúvida no caminho?<span>Estamos aqui para facilitar.</span></p><button type="button" onClick={() => setDialogo("ajuda")}>Ver ajuda<Icon name="arrow" size={16} /></button></div>
            </main>

            <footer className="site-footer"><span>© {new Date().getFullYear()} PortalMix<span className="footer-separator">/</span>Seu supermercado, mais perto de você.</span><div><span className="academic-badge"><span />Projeto acadêmico de IHC</span><button type="button" onClick={() => setDialogo("privacidade")}>Privacidade</button></div></footer>

            <p role="status" aria-live="polite" className={aviso ? "status-toast" : "sr-only"}>{aviso || `Etapa ${etapa} de 3: ${["Seus dados", "Revisão", "Conclusão"][etapa - 1]}`}</p>

            <dialog ref={modal} className="dialog" aria-labelledby="dialog-title" onCancel={() => setDialogo(null)} onClose={() => setDialogo(null)} onClick={(event) => { if (event.target === event.currentTarget) { const box = event.currentTarget.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) setDialogo(null); } }}>
                <div className="dialog-header"><span className="dialog-icon"><Icon name={dialogo === "limpar" ? "alert" : dialogo === "privacidade" ? "shield" : "help"} size={24} /></span><button type="button" className="icon-button" aria-label="Fechar janela" onClick={() => setDialogo(null)}><Icon name="close" /></button></div>
                <h2 id="dialog-title">{dialogo ? titulosDialogos[dialogo] : ""}</h2>
                {dialogo === "ajuda" && <div className="dialog-copy"><p>O cadastro tem três passos: preencha, revise e conclua a simulação.</p><h3>O que preciso preencher?</h3><p>Nome, e-mail e preferência de compra. A data de nascimento e o recebimento de ofertas são opcionais.</p><h3>Como corrijo uma informação?</h3><p>Na revisão, use “Editar dados”. Se houver um erro, a mensagem ao lado do campo explica como corrigir.</p><h3>Posso usar o teclado?</h3><p>Use Tab para avançar, Shift + Tab para voltar e Enter para acionar o botão em foco. Escape fecha esta janela.</p><p className="dialog-footnote">Esta demonstração não cria contas nem envia mensagens.</p></div>}
                {dialogo === "privacidade" && <div className="dialog-copy"><p>Esta página é uma demonstração acadêmica de usabilidade, sem serviço de cadastro conectado.</p><p>Os campos ficam somente na memória desta página. Não usamos cookies, armazenamento local ou ferramentas de análise para guardar seu preenchimento.</p><p>Ao recarregar ou fechar a página, os dados do formulário são descartados. Você também pode usar “Limpar dados”.</p><p>A preferência de receber ofertas é apenas demonstrativa. Nenhuma mensagem será enviada.</p></div>}
                {dialogo === "como-funciona" && <div className="dialog-copy"><ol className="how-list"><li><strong>1. Preencha seus dados</strong><p>Informe nome, e-mail e como prefere fazer suas compras.</p></li><li><strong>2. Revise com calma</strong><p>Confira o resumo e volte para editar o que precisar.</p></li><li><strong>3. Conclua a demonstração</strong><p>Veja a confirmação. Nenhuma conta real será criada.</p></li></ol></div>}
                {dialogo === "limpar" ? <><p className="dialog-copy">Todos os campos e preferências serão apagados. Esta ação não pode ser desfeita.</p><div className="dialog-actions"><button type="button" className="button-secondary" onClick={() => setDialogo(null)}>Continuar preenchendo</button><button type="button" className="button-danger" onClick={limpar}>Sim, limpar dados</button></div></> : <button type="button" className="button-primary mt-6 w-full justify-center" onClick={() => setDialogo(null)}>Entendi<Icon name="check" size={17} /></button>}
            </dialog>
        </div>
    );
}
