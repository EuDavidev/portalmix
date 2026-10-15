export type DadosCadastro = {
    nome: string;
    email: string;
    data: string;
    tipo: string;
    novidades: boolean;
};

export type CampoCadastro = "nome" | "email" | "data" | "tipo";
export type ErrosCadastro = Partial<Record<CampoCadastro, string>>;

export const preferenciasDeCompra: Record<string, string> = {
    loja: "Na loja",
    entrega: "Entrega em casa",
    retirada: "Retirada na loja",
};

export const dadosIniciais: DadosCadastro = {
    nome: "",
    email: "",
    data: "",
    tipo: "",
    novidades: false,
};

export function dataLocalISO(data: Date): string {
    return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}-${String(data.getDate()).padStart(2, "0")}`;
}

export function validarCadastro(dados: DadosCadastro, hoje = new Date()): ErrosCadastro {
    const erros: ErrosCadastro = {};
    const nome = dados.nome.trim();
    const email = dados.email.trim();

    if (nome.length < 2 || nome.length > 100) {
        erros.nome = "Informe seu nome, entre 2 e 100 caracteres.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
        erros.email = "Informe um e-mail válido, como nome@exemplo.com.";
    }
    if (!Object.hasOwn(preferenciasDeCompra, dados.tipo)) {
        erros.tipo = "Escolha como fazer suas compras.";
    }
    if (dados.data) {
        const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dados.data);
        const data = new Date(`${dados.data}T12:00:00`);
        const real = partes && Number(partes[1]) > 0 &&
            !Number.isNaN(data.getTime()) && dataLocalISO(data) === dados.data;
        if (!real) {
            erros.data = "Informe uma data de nascimento válida.";
        } else if (dados.data > dataLocalISO(hoje)) {
            erros.data = "A data não pode estar no futuro.";
        }
    }
    return erros;
}
