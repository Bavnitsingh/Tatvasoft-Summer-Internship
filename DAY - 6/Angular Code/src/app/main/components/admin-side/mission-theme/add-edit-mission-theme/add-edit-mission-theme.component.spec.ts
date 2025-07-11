import { type ComponentFixture, TestBed } from "@angular/core/testing"

import { AddEditMissionThemeComponent } from "./add-edit-mission-theme.component"

describe("AddMissionThemeComponent", () => {
  let component: AddEditMissionThemeComponent
  let fixture: ComponentFixture<AddEditMissionThemeComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditMissionThemeComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(AddEditMissionThemeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
