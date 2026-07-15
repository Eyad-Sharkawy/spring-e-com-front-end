import { TestBed } from "@angular/core/testing";

import { CartApi } from "./cart-api";

describe("CartApi", () => {
  let service: CartApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartApi);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
