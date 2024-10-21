using System;

namespace PayStarAdminDashboard.Services.ApiRequestObjects
{
    [Serializable]
    public class ClientV2RequestObject
    {
        public int PayStarClientId { get; set; }
        public string OrgName { get; set; }
        public string BusinessUnitName { get; set; }
        public string Slug { get; set; }
    }
}