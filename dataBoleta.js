module.exports = {
    Documento: {
        Encabezado: {
            IdDoc: {
                TipoDTE: 39,
                Folio: 167,
                FchEmis: '2020-10-10',
                IndServicio: 3
            },
            Emisor: {
                RUTEmisor: '99999999-9',
                RznSocEmisor: 'Abstrahere SpA',
                GiroEmisor: 'Computacion'
            },
            Receptor: {
                RUTRecep: '66666666-6',
                RznSocRecep: 'CLIENTE'
            },
            Totales: {
                IVA: 100,
                MntTotal: 10001194
            }
        },
        Detalle: [
            {
                CdgItem: {
                    TpoCodigo: 'ccc',
                    VlrCodigo: 'vvv'
                },
                NroLinDet: 1,
                NmbItem: 'ALCOHOL DES 70° 0125 ML',
                QtyItem: 1,
                PrcItem: 2100,
                DescuentoPct: 5,
                DescuentoMonto: 105,
                MontoItem: 1195
            },
            {
                NroLinDet: 2,
                NmbItem: 'TERMÓMETRO CLÍNICO PLANO',
                QtyItem: 999,
                PrcItem: 1050,
                MontoItem: 9999999
            }
        ]
    },
    Adicionales: {}

}