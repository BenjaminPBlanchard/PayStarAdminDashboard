using System;

namespace PayStarAdminDashboard.Services.ApiRequestObjects
{
    [Serializable]
    public class ClientV1RequestObject
    {
        public int PayStarClientId { get; set; }
        public string OrgName { get; set; }
        public string BusinessUnitName { get; set; }
        public bool IsMigratedToV2 { get; set; }
    }
}