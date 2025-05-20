// App React com upload de arquivo Excel (SINAPI)
import React, { useState } from 'react';
import * as XLSX from 'xlsx';

export default function OrcamentoApp() {
  const [itensSINAPI, setItensSINAPI] = useState([]);
  const [itensSelecionados, setItensSelecionados] = useState([]);

  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const workbook = XLSX.read(bstr, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const novosItens = data.slice(1).map((row) => {
        return {
          codigo: row[0],
          nome: row[1],
          unidade: row[2],
          preco: parseFloat(row[3]) || 0,
        };
      }).filter(item => item.codigo && item.nome);

      setItensSINAPI(novosItens);
    };
    reader.readAsBinaryString(file);
  };

  const adicionarItem = (item) => {
    setItensSelecionados([...itensSelecionados, { ...item, quantidade: 1 }]);
  };

  const atualizarQuantidade = (index, quantidade) => {
    const novosItens = [...itensSelecionados];
    novosItens[index].quantidade = quantidade;
    setItensSelecionados(novosItens);
  };

  const total = itensSelecionados.reduce((soma, item) => soma + item.preco * item.quantidade, 0);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Orçamento de Engenharia - SINAPI</h1>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Importar Tabela SINAPI (Excel):</label>
        <input type="file" accept=".xlsx, .xls" onChange={handleExcelUpload} className="border p-2" />
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Itens disponíveis (SINAPI)</h2>
        {itensSINAPI.length === 0 && <p className="text-gray-600 mt-2">Nenhum item carregado. Importe um arquivo Excel.</p>}
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
          {itensSINAPI.map((item) => (
            <li key={item.codigo} className="border p-2 rounded shadow-sm flex justify-between items-center">
              <div>
                <p className="font-medium">{item.nome}</p>
                <p className="text-sm text-gray-600">R$ {item.preco.toFixed(2)} / {item.unidade}</p>
              </div>
              <button
                onClick={() => adicionarItem(item)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Adicionar
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Itens do Orçamento</h2>
        <table className="w-full mt-2 border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Item</th>
              <th className="p-2 border">Unid.</th>
              <th className="p-2 border">Qtd.</th>
              <th className="p-2 border">Preço Unit.</th>
              <th className="p-2 border">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {itensSelecionados.map((item, idx) => (
              <tr key={idx}>
                <td className="p-2 border">{item.nome}</td>
                <td className="p-2 border">{item.unidade}</td>
                <td className="p-2 border">
                  <input
                    type="number"
                    value={item.quantidade}
                    min={0}
                    onChange={(e) => atualizarQuantidade(idx, parseFloat(e.target.value))}
                    className="w-16 border px-1"
                  />
                </td>
                <td className="p-2 border">R$ {item.preco.toFixed(2)}</td>
                <td className="p-2 border">R$ {(item.preco * item.quantidade).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-right font-bold mt-4 text-lg">
          Total: R$ {total.toFixed(2)}
        </div>
      </div>
    </div>
  );
}
