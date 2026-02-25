import { faVirusSlash } from '@fortawesome/free-solid-svg-icons';
import pdfMake from 'pdfmake/build/pdfmake';
import printjs from 'print-js';



// import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : (pdfFonts.vfs || pdfFonts);

// const pdfFonts = await import('pdfmake/build/vfs_fonts');
// pdfMake.vfs = pdfFonts.pdfMake?.vfs || pdfFonts.default?.pdfMake?.vfs;

const createPdf = async (props, output = 'print') => {
 try {
    // 1. Importación dinámica adaptada a bundles de producción
    const pdfFonts = await import('pdfmake/build/vfs_fonts');
    
    // 2. Extracción segura del VFS:
    // En Netlify/Vite, pdfFonts suele venir como un módulo con una propiedad default o directamente pdfMake
    const vfs = pdfFonts.default?.pdfMake?.vfs || 
                pdfFonts.pdfMake?.vfs || 
                pdfFonts.default?.vfs || 
                pdfFonts.vfs;

    if (!vfs) {
      throw new Error("No se pudo localizar el VFS en vfs_fonts");
    }

    // 3. Asignación al objeto pdfMake
    pdfMake.vfs = vfs;

    // 4. Mapeo de fuentes para evitar el error 'Roboto-Medium.ttf' not found
    // Obligamos a que todas las variantes usen los archivos que SÍ están en el VFS básico
    pdfMake.fonts = {
      Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Regular.ttf', 
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-Italic.ttf'
      }
    };
  } catch (e) {
    console.error("Error crítico cargando vfs_fonts en Netlify:", e);
  }
  return new Promise((resolve, reject) => {
    try {
      const {
        pageSize = {
          width: 595.28,
          height: 790.995
        },

        pageMargins = [40.66, 30.66, 35.66, 30.66],
        info = {
          title: 'hictoria clinica',
          author: 'System sucre',
          subject: 'cONSULTORIA DE SOWFARE Z/EX-ESTACION PARQUE-BOLIVAR',
          keywords: 'DESARROLLO DE S.I.',
        },
        styles = {
          header: {
            fontSize: 8,
            bold: true,
            alignment: 'center',
          },
          tHeaderLabel: {
            fontSize: 7,
            alignment: 'right',
          },
          fechaTratamiento: {
            margin: [0, 1, 0, 10],
            fontSize: 7,
            bold: true,
          },
          nhcheader: {
            fontSize: 10,
            margin: [0, 0, 0, 0],
            bold: true,
            alignment: 'left',
          },
          tProductsHeader: {
            fontSize: 7.5,
            bold: true,
          },
          text: {
            margin: [0, 1, 0, 0],
            fontSize: 9,
            alignment: 'center',
          },
          line: {
            margin: [0, 0, 0, 0],
            fontSize: 14,
            color: '#4E5AFE',
            bold: true,
            alignment: 'center',
          },
          piePagina: {
            fontSize: 6,
            alignment: 'center',
          },
          tankYou: {
            fontSize: 10,
            alignment: 'center',
          },
          hc: {
            fontSize: 15,
            bold: true,
            alignment: 'center',
          },
          link: {
            fontSize: 7,
            bold: true,
            margin: [0, 0, 0, 4],
            alignment: 'center',
          },
        },
        content,


      } = props;

      const docDefinition = {
        pageSize, //TAMAÑO HOJA
        pageMargins, //MARGENES HOJA
        info, //METADATA PDF
        content, // CONTENIDO PDF
        styles, //ESTILOS PDF
      };

      if (output === 'b64') {
        //SI INDICAMOS QUE LA SALIDA SERA [b64] Base64
        const pdfMakeCreatePdf = pdfMake.createPdf(docDefinition);
        pdfMakeCreatePdf.getBase64((data) => {
          resolve({
            success: true,
            content: data,
            message: 'Archivo generado correctamente.',
          });
        });
        return;
      }

      //ENVIAR A IMPRESIÓN DIRECTA
      if (output === 'print') {
        const pdfMakeCreatePdf = pdfMake.createPdf(docDefinition);
        pdfMakeCreatePdf.getBase64((data) => {
          printjs({
            printable: data,
            type: 'pdf',
            base64: true,
          });
          resolve({
            success: true,
            content: null,
            message: 'Documento enviado a impresión.',
          });
        });
        return;
      }

      reject({
        success: false,
        content: null,
        message: 'Debes enviar tipo salida.',
      });
    } catch (error) {
      reject({
        success: false,
        content: null,
        message: error?.message ?? 'No se pudo generar proceso.',
      });
    }
  });
};

export default createPdf;
