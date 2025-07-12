import { type ComponentFixture, TestBed } from "@angular/core/testing"

import { SearchingSortingComponent } from "./searching-sorting.component"

describe("SearchinSortingComponent", () => {
  let component: SearchingSortingComponent
  let fixture: ComponentFixture<SearchingSortingComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchingSortingComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(SearchingSortingComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
