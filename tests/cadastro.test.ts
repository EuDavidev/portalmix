import assert from "node:assert/strict";
import { test } from "node:test";
import { validarCadastro, type DadosCadastro } from "../src/lib/cadastro.ts";

const hoje = new Date(2026, 9, 15, 12);
const valido: DadosCadastro = {
    nome: "Ana Souza",
    email: "ana+portal@exemplo.com.br",
    data: "",
    tipo: "loja",
    novidades: false,
};

test("campos obrigatórios vazios recebem instruções de correção", () => {
    const erros = validarCadastro({ ...valido, nome: "  ", email: "", tipo: "" }, hoje);
    assert.match(erros.nome ?? "", /nome/i);
    assert.match(erros.email ?? "", /e-mail/i);
    assert.match(erros.tipo ?? "", /compras/i);
    assert.equal(erros.data, undefined);
});

test("cadastro válido aceita nascimento omitido e comunicações recusadas", () => {
    assert.deepEqual(validarCadastro(valido, hoje), {});
});

test("aceita nomes internacionais e espaços externos sem alterar os dados", () => {
    const dados = { ...valido, nome: "  João D’Ávila  ", email: " ana@exemplo.com " };
    assert.deepEqual(validarCadastro(dados, hoje), {});
    assert.equal(dados.nome, "  João D’Ávila  ");
});

test("e-mails incompletos ou com espaços internos são rejeitados", () => {
    for (const email of ["ana", "ana@", "ana@dominio", "ana @exemplo.com", "a@b@exemplo.com"]) {
        assert.ok(validarCadastro({ ...valido, email }, hoje).email, email);
    }
});

test("limita comprimentos excessivos sem truncar silenciosamente", () => {
    assert.ok(validarCadastro({ ...valido, nome: "A".repeat(101) }, hoje).nome);
    assert.ok(validarCadastro({ ...valido, email: `${"a".repeat(250)}@b.com` }, hoje).email);
});

test("datas futuras e datas impossíveis são rejeitadas", () => {
    for (const data of ["2026-10-16", "2030-01-01", "2025-02-29", "2024-02-30", "2020-13-01", "2020-00-01", "0000-01-01", "15/10/2000"]) {
        assert.ok(validarCadastro({ ...valido, data }, hoje).data, data);
    }
});

test("aceita dia atual, ano bissexto e datas anteriores a 1900", () => {
    for (const data of ["2026-10-15", "2024-02-29", "1890-06-10"]) {
        assert.deepEqual(validarCadastro({ ...valido, data }, hoje), {}, data);
    }
});

test("aceita preferências de compra do supermercado e recusa opções antigas", () => {
    assert.ok(validarCadastro({ ...valido, tipo: "pessoal" }, hoje).tipo);
    for (const tipo of ["loja", "entrega", "retirada"]) {
        assert.deepEqual(validarCadastro({ ...valido, tipo }, hoje), {});
    }
});
