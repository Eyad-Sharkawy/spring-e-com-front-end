import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AddProductHeader } from "./add-product-header";

describe("AddProductHeader", () => {
  let component: AddProductHeader;
  let fixture: ComponentFixture<AddProductHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProductHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(AddProductHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
