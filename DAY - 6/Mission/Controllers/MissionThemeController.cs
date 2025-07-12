using Microsoft.AspNetCore.Mvc;
using Mission.Entities;
using Mission.Entities.Models;
using Mission.Services.IServices;
using Mission.Services.Services;

namespace Mission.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MissionThemeController(IMissionThemeService missionThemeService) : ControllerBase
    {
        private readonly IMissionThemeService _missionThemeService = missionThemeService;

        [HttpGet]
        [Route("GetMissionThemeList")]
        public async Task<IActionResult> GetAllMissionTheme()
        {
            try
            {
                var res = await _missionThemeService.GetAllMissionTheme();
                return Ok(new ResponseResult() { Data = res, Result = ResponseStatus.Success, Message = "" });
            }
            catch
            {
                return BadRequest(new ResponseResult() { Data = null, Result = ResponseStatus.Error, Message = "Failed to get mission theme" });
            }
        }

        [HttpPost]
        [Route("AddMissionTheme")]
        public async Task<IActionResult> AddMissionTheme(MissionThemeViewModel missionThemeViewModel)
        {
            try
            {
                var res = await _missionThemeService.AddMissionTheme(missionThemeViewModel);
                return Ok(new ResponseResult() { Data = "Add Mission theme.", Result = ResponseStatus.Success, Message = "" });
            }
            catch
            {
                return BadRequest(new ResponseResult() { Data = null, Result = ResponseStatus.Error, Message = "Failed to add mission theme" });
            }
        }

        [HttpGet]
        [Route("GetMissionThemeById/{id:int}")]
        public async Task<IActionResult> GetMissionThemeById(int id)
        {
            var res = await _missionThemeService.GetMissionThemeById(id);

            if (res == null)
                return NotFound(new ResponseResult() { Data = "Not Found", Result = ResponseStatus.Error, Message = "" });

            return Ok(new ResponseResult() { Data = res, Result = ResponseStatus.Success, Message = "" });
        }

        [HttpPost]
        [Route("UpdateMissionTheme")]
        public async Task<IActionResult> UpdateMissionTheme(MissionThemeViewModel missionThemeViewModel)
        {
            var res = await _missionThemeService.UpdateMissionTheme(missionThemeViewModel);

            if (!res)
                return NotFound(new ResponseResult() { Data = "Not Found", Result = ResponseStatus.Error, Message = "" });

            return Ok(new ResponseResult() { Data = res, Result = ResponseStatus.Success, Message = "" });
        }

        [HttpDelete]
        [Route("DeleteMissionTheme{id:int}")]
        public async Task<IActionResult> DeleteMissionTheme(int id)
        {
            var res = await _missionThemeService.DeleteMissionTheme(id);

            if (!res)
                return NotFound(new ResponseResult() { Data = "Not Found", Result = ResponseStatus.Error, Message = "" });

            return Ok(new ResponseResult() { Data = res, Result = ResponseStatus.Success, Message = "Record Delete Successfully" });
        }
    }
}
