import { Component, OnInit } from '@angular/core';
import { Producto } from '../../models/producto';
import { ProductoService } from '../../services/producto.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDialogService } from '../../services/modal-dialog.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  productosArray: Producto[];
  AccionABMC = 'L';
  FormAlta: FormGroup;
  submitted: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    private productoService: ProductoService,
    private modalDialogService: ModalDialogService
  ) {}

  ngOnInit() {
    this.FormAlta = this.formBuilder.group({
      ProductoID: [0],
      ProductoNombre: [
        null,
        [Validators.required, Validators.minLength(5), Validators.maxLength(50)]
      ],
      FechaAlta: [
        null,
        [
          Validators.required,
          Validators.pattern(
            '(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[012])[-/](19|20)[0-9]{2}'
          )
        ]
      ],
      ProductoStock: [
        null,
        [Validators.required, Validators.pattern('^\\d{1,10}$')]
      ]
    });

    this.GetProductos();
  }

  GetProductos() {
    this.productoService.get().subscribe((res: Producto[]) => {
      this.productosArray = res;
    });
  }

  Agregar() {
    this.AccionABMC = 'A';
    this.FormAlta.reset({ ProductoID: 0 });
    this.submitted = false;
    this.FormAlta.markAsUntouched();
  }

  Grabar() {
    this.submitted = true;
    if (this.FormAlta.invalid) {
      return;
    }
    const itemCopy = { ...this.FormAlta.value };
    var arrFecha = itemCopy.ProductoFechaAlta.substr(0, 10).split('/');
    if (arrFecha.length == 3)
      itemCopy.ProductoFechaAlta = new Date(
        arrFecha[2],
        arrFecha[1] - 1,
        arrFecha[0]
      ).toISOString();

    // agregar post
    if (this.AccionABMC == 'A') {
      this.productoService.post(itemCopy).subscribe((res: any) => {
        this.Cancelar();
        this.modalDialogService.Alert('Registro agregado correctamente.');
        this.modalDialogService.DesbloquearPantalla();
      });
    } else {
      this.productoService
        .put(itemCopy.ProductoID, itemCopy)
        .subscribe((res: any) => {
          this.Cancelar();
          this.modalDialogService.Alert('Registro modificado correctamente.');
          this.modalDialogService.DesbloquearPantalla();
        });
    }
    this.AccionABMC = 'L';
  }

  Cancelar() {
    this.AccionABMC = 'L';
  }
}
