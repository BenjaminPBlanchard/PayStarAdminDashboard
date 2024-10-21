namespace PayStarAdminDashboard.Data.Entities
{
    public class JobExpectation
    {
        public int Id { get; set; }
        public int Days { get; set; }
        public int Hours { get; set; }
        public int JobId { get; set; }
        public Jobs Job { get; set; }
    }
}