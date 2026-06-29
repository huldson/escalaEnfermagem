
let ListaEnfermeiros = []
let ListaPaciente = []
let cond = 0;
let condP = 0;
let imprimir = []
function adicionarEnfermeiro() {
    const enfermeiro = new Enfermeiro(document.getElementById("nome").value,
        document.getElementById("nivel").value,
        cond)
    cond++
    ListaEnfermeiros.push(enfermeiro);
    exibirLitar()


}

function adicionarPaciente() {
    const paciente = new Paciente(document.getElementById("nomePaciente").value,
        document.getElementById("estado").value,
        condP)

    condP++
    ListaPaciente.push(paciente);
    exibirListarPaciente()


}
function removerEnfermeiro(codigo) {
    let listaFiltrada = ListaEnfermeiros.filter(x => x.codigo != codigo)
    ListaEnfermeiros = listaFiltrada
    exibirLitar();
}
function removerPaciente(codigo) {
    let listaFiltrada = ListaPaciente.filter(x => x.codigo != codigo)
    ListaPaciente = listaFiltrada
    exibirListarPaciente();
}

function exibirLitar() {
    let lista = document.getElementById("lista")
    lista.innerHTML = ListaEnfermeiros.map((x, i) => `
    <li class="list-group-item d-flex justify-content-between align-items-center ${i % 2 == 0 ? 'bg-light' : 'bg-white'}">
        <div>
            <div><strong>Nome:</strong> ${x.nome}</div>
            <div><strong>Nível:</strong> ${x.nivel}</div>
        </div>

        <button class="btn btn-danger btn-sm" onclick="removerEnfermeiro(${x.codigo})">
            Remover
        </button>
    </li>
`).join("");
}

function exibirListarPaciente() {
    let lista = document.getElementById("listaPacientes")
    lista.innerHTML = ListaPaciente.map((x, i) => `
    <li class="list-group-item d-flex justify-content-between align-items-center ${i % 2 == 0 ? 'bg-light' : 'bg-white'}">
        <div>
            <div><strong>Nome:</strong> ${x.nome}</div>
            <div><strong>Condição:</strong> ${x.acamado}</div>
        </div>

        <button class="btn btn-danger btn-sm" onclick="removerPaciente(${x.codigo})">
            Remover
        </button>
    </li>
`).join("");
}

class Enfermeiro {
    constructor(nome, nivel, codigo) {
        this.nome = nome
        this.nivel = nivel
        this.codigo = codigo
        this.pacientes = []
    }
}

class Paciente {
    constructor(nome, acamado, codigo) {
        this.nome = nome
        this.acamado = acamado
        this.codigo = codigo
    }


}
function processar() {

    let enfermeiros = [...ListaEnfermeiros]
        .sort((a, b) => ordem[a.nivel] - ordem[b.nivel]);
    let pacientesACamados = ListaPaciente.filter(x => x.acamado == "Acamado")
    let pacientesNCamados = ListaPaciente.filter(x => x.acamado != "Acamado")
    let pacientes = [...pacientesACamados, ...pacientesNCamados]
    let controle = 0
    pacientes.forEach(paciente => {
        paciente
        enfermeiros[controle].pacientes.push(paciente)
        controle++
        if (controle == enfermeiros.length) {
            controle = 0;
        }
    }
    )

    const resultado = document.getElementById("resultadoEscala");

    resultado.innerHTML = "";

    imprimir = enfermeiros

    enfermeiros.forEach(enfermeiro => {

        let htmlPacientes = "";

        enfermeiro.pacientes.forEach(paciente => {
            htmlPacientes += `
            <li class="list-group-item">
                <strong>${paciente.nome}</strong>
                <span class="badge bg-${paciente.acamado == "Acamado" ? "danger" : "success"} float-end">
                    ${paciente.acamado}
                </span>
            </li>
        `;
        });

        resultado.innerHTML += `
        <div class="card mb-3 border-primary">
            <div class="card-header bg-primary text-white">
                <strong>👨‍⚕️ ${enfermeiro.nome}</strong>
                <span class="float-end">${enfermeiro.nivel}</span>
            </div>

            <div class="card-body">
                <ul class="list-group">
                    ${htmlPacientes}
                </ul>
            </div>
        </div>
    `;
    });


}

const ordem = {
    Senior: 3,
    Pleno: 2,
    Junior: 1
};

function gerarPDF() {

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const data = new Date().toLocaleDateString("pt-BR");

    let y = 10;

    doc.setFontSize(16);
    doc.text("Escala de Enfermagem", 10, y);

    y += 10;
    doc.setFontSize(12);
    doc.text("Data: " + data, 10, y);

    y += 10;

    imprimir.forEach(enfermeiro => {

        doc.setFontSize(14);
        doc.text(`Enfermeiro: ${enfermeiro.nome} (${enfermeiro.nivel})`, 10, y);
        y += 8;

        enfermeiro.pacientes.forEach(paciente => {

            const texto = `- ${paciente.nome} | ${paciente.acamado}`;
            doc.setFontSize(11);
            doc.text(texto, 15, y);

            y += 6;

            // quebra de página se necessário
            if (y > 280) {
                doc.addPage();
                y = 10;
            }
        });

        y += 6;
    });

    doc.save(`escala-${data}.pdf`);
}