import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AddProductForm } from "./add-product-form";

describe("AddProductForm", () => {
  let component: AddProductForm;
  let fixture: ComponentFixture<AddProductForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProductForm],
    }).compileComponents();

    fixture = TestBed.createComponent(AddProductForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
