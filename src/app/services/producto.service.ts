import { Injectable } from '@angular/core';
import { IDatos } from '../interfaces/producto';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Img, PdfMakeWrapper, Txt, Table, Item} from 'pdfmake-wrapper';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  url = 'http://localhost:8080/producto';



  constructor(private http : HttpClient) { }

  getProductos() : Observable<IDatos[]> {

    return this.http.get<IDatos[]>(`${this.url}`);
  }

  saveProducto(data : IDatos){
    //console.log(data.type)
    return this.http.post(`${this.url}`,data);
  }

  getProductobyId(code : any) {
    return this.http.get(`${this.url}/${code}`);
  }

  editProducto( codigo : number, nombre : any, precio : any, tipo : any, foto : any){

    return this.http.put(this.url,{"codigoProducto": codigo, "nombre": nombre, "precio": precio, "tipo": tipo, "foto" : foto});
  }

  deleteProducto(code : any){
    return this.http.delete(`${this.url}/${code}`);
  }

  // agregado para lo del pdf

  async generarPdfMake(titulo : string, data : IDatos[] ) {
    const pdf = new PdfMakeWrapper();
    pdf.add(new Txt(`${titulo}`).alignment('right').italics().margin(10).end);
    pdf.add(new Txt('REPORTE DE PRODUCTOS').color('blue').fontSize(18).bold().alignment('center').end);
    pdf.add(new Txt(' ').end);
    // pdf.add();
    pdf.add(new Txt(' ').end);
    pdf.add(new Txt('Productos:').margin(15).bold().decoration('underline').end);
    pdf.add(new Txt(' ').margin(15).end);
    pdf.add(new Table([['','Producto','Precio','tipo']])
    .alignment('center').widths([50,200,200,150]).fontSize(12).italics().bold().layout('lightHorizontalLines').end);
    for(let x of data) {
      pdf.add(new Table([
        ['','','',''],
        [await new Img(`${x.foto}`).height(50).width(50).build(), `${x.nombre}`,`${x.precio}`,`${(x.tipo == 1) ? 'Alcolico' : 'no Alcolico'}`]
      ]).widths([50,200,200,150]).fontSize(10).layout('lightHorizontalLines').end);
    }
    pdf.add(new Txt(' ').margin(20).end);

    pdf.footer(new Txt(' ' + new Date()).alignment('left').italics().margin(10).end);
    pdf.pageOrientation('landscape');
    pdf.create().open();
}

}
