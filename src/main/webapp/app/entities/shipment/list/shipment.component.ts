import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IShipment } from '../shipment.model';
import { ShipmentService } from '../service/shipment.service';
import { ShipmentDeleteDialogComponent } from '../delete/shipment-delete-dialog.component';

@Component({
  selector: 'jhi-shipment',
  templateUrl: './shipment.component.html',
})
export class ShipmentComponent implements OnInit {
  shipments?: IShipment[];
  isLoading = false;

  constructor(protected shipmentService: ShipmentService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.shipmentService.query().subscribe({
      next: (res: HttpResponse<IShipment[]>) => {
        this.isLoading = false;
        this.shipments = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IShipment): number {
    return item.id!;
  }

  delete(shipment: IShipment): void {
    const modalRef = this.modalService.open(ShipmentDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.shipment = shipment;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
