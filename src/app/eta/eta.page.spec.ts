import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EtaPage } from './eta.page';

describe('EtaPage', () => {
  let component: EtaPage;
  let fixture: ComponentFixture<EtaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EtaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
