import { Component, OnInit } from '@angular/core';
import { EmpresaService } from '../../../service/SaaS/empresa.service';
import { Empresa } from '../../../api/empresa/empresa.model';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  providers: [MessageService, ConfirmationService]
})
export class EmpresasComponent implements OnInit {
  empresas: Empresa[] = [];
  empresa: Empresa = {
    Nombre: '',
    Email: '',
    Estado: 'Activa',
    FechaRegistro: new Date()
  };
  displayDialog: boolean = false;
  isNew: boolean = false;

  constructor(
    private empresaService: EmpresaService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadEmpresas();
  }

  loadEmpresas() {
    this.empresaService.getEmpresas().subscribe(
      (data) => {
        this.empresas = data;
      },
      (error) => {
        this.messageService.add({severity:'error', summary: 'Error', detail: 'No se pudieron cargar las empresas'});
      }
    );
  }

  showDialogToAdd() {
    this.isNew = true;
    this.empresa = {
      Nombre: '',
      Email: '',
      Estado: 'Activa',
      FechaRegistro: new Date()
    };
    this.displayDialog = true;
  }

  showDialogToEdit(empresa: Empresa) {
    this.isNew = false;
    this.empresa = {...empresa};
    this.displayDialog = true;
  }

  saveEmpresa() {
    if (this.isNew) {
      this.empresa.FechaRegistro = new Date();
      this.empresaService.createEmpresa(this.empresa).subscribe(
        () => {
          this.messageService.add({severity:'success', summary: 'Éxito', detail: 'Empresa creada'});
          this.loadEmpresas();
        },
        (error) => {
          this.messageService.add({severity:'error', summary: 'Error', detail: 'No se pudo crear la empresa'});
        }
      );
    } else {
      this.empresaService.updateEmpresa(this.empresa.Id, this.empresa).subscribe(
        () => {
          this.messageService.add({severity:'success', summary: 'Éxito', detail: 'Empresa actualizada'});
          this.loadEmpresas();
        },
        (error) => {
          this.messageService.add({severity:'error', summary: 'Error', detail: 'No se pudo actualizar la empresa'});
        }
      );
    }
    this.displayDialog = false;
  }

  deleteEmpresa(empresa: Empresa) {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar esta empresa?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.empresaService.deleteEmpresa(empresa.Id).subscribe(
          () => {
            this.messageService.add({severity:'success', summary: 'Éxito', detail: 'Empresa eliminada'});
            this.loadEmpresas();
          },
          (error) => {
            this.messageService.add({severity:'error', summary: 'Error', detail: 'No se pudo eliminar la empresa'});
          }
        );
      }
    });
  }
}