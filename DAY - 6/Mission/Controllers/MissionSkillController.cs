using Microsoft.AspNetCore.Mvc;
using Mission.Entities.Models;
using Mission.Entities;
using Mission.Services.IServices;

namespace Mission.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MissionSkillController(IMissionSkillService missionSkillService) : ControllerBase
    {
        private readonly IMissionSkillService _missionSkillService = missionSkillService;

        [HttpGet]
        [Route("GetMissionSkillList")]
        public async Task<IActionResult> GetAllMissionSkill()
        {
            try
            {
                var res = await _missionSkillService.GetAllMissionSkill();
                return Ok(new ResponseResult() { Data = res, Result = ResponseStatus.Success, Message = "" });
            }
            catch
            {
                return BadRequest(new ResponseResult() { Data = null, Result = ResponseStatus.Error, Message = "Failed to get mission Skill" });
            }
        }

        [HttpPost]
        [Route("AddMissionSkill")]
        public async Task<IActionResult> AddMissionSkill(MissionSkillViewModel missionSkillViewModel)
        {
            try
            {
                var res = await _missionSkillService.AddMissionSkill(missionSkillViewModel);
                return Ok(new ResponseResult() { Data = res, Result = ResponseStatus.Success, Message = "" });
            }
            catch
            {
                return BadRequest(new ResponseResult() { Data = null, Result = ResponseStatus.Error, Message = "Failed to add mission Skill" });
            }
        }

        [HttpGet]
        [Route("GetMissionSkillById/{id:int}")]
        public async Task<IActionResult> GetMissionSkillById(int id)
        {
            var res = await _missionSkillService.GetMissionSkillById(id);

            if (res == null)
                return NotFound(new ResponseResult() { Data = "Not Found", Result = ResponseStatus.Error, Message = "" });

            return Ok(new ResponseResult() { Data = res, Result = ResponseStatus.Success, Message = "" });
        }

        [HttpPost]
        [Route("UpdateMissionSkill")]
        public async Task<IActionResult> UpdateMissionSkill(MissionSkillViewModel missionSkillViewModel)
        {
            var res = await _missionSkillService.UpdateMissionSkill(missionSkillViewModel);

            if (!res)
                return NotFound(new ResponseResult() { Data = "Not Found", Result = ResponseStatus.Error, Message = "" });

            return Ok(new ResponseResult() { Data = res, Result = ResponseStatus.Success, Message = "" });
        }

        [HttpDelete]
        [Route("DeleteMissionSkill/{id:int}")]
        public async Task<IActionResult> DeleteMissionSkill(int id)
        {
            var res = await _missionSkillService.DeleteMissionSkill(id);

            if (!res)
                return NotFound(new ResponseResult() { Data = "Not Found", Result = ResponseStatus.Error, Message = "" });

            return Ok(new ResponseResult() { Data = res, Result = ResponseStatus.Success, Message = "Record Deleted Successfully" });
        }
    }
}
