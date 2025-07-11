import { type ComponentFixture, TestBed } from "@angular/core/testing"

import { AddEditMissionSkillComponent } from "./add-edit-mission-skill.component"

describe("AddMissionSkillComponent", () => {
  let component: AddEditMissionSkillComponent
  let fixture: ComponentFixture<AddEditMissionSkillComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditMissionSkillComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(AddEditMissionSkillComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
