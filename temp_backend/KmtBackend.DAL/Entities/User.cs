using KmtBackend.Models.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KmtBackend.DAL.Entities
{
    public class User : BaseEntity
    {      
        [Required]
        [MaxLength(50)]
        public string Username { get; set; } = null!;
        
        [Required]
        [MaxLength(100)]
        [EmailAddress]
        public string Email { get; set; } = null!;

        [Required]
        [MaxLength(13)]
        [Phone]
        public string PhoneNumber { get; set; } = null!;

        [Required]
        public string PasswordHash { get; set; } = null!;

        public virtual ICollection<Role> Roles { get; set; } = [];

        public Guid? DepartmentId { get; set; }
        
        [ForeignKey("DepartmentId")]
        public Department? Department { get; set; }

        public Guid? TitleId { get; set; }

        [ForeignKey("TitleId")]
        public Title? Title { get; set; }

        [Required]
        public DateTime HireDate { get; set; }

        public DateTime? TerminationDate { get; set; }

        public virtual ICollection<LeaveBalance> LeaveBalances { get; set; } = [];

        public virtual ICollection<LeaveRequest> LeaveRequests { get; set; } = [];

        [Required]
        public int PriorWorkExperienceMonths { get; set; }


        [NotMapped]
        public int TotalWorkExperienceMonths =>
            PriorWorkExperienceMonths +
            ((DateTime.UtcNow.Year - HireDate.Year) * 12) +
            (DateTime.UtcNow.Month - HireDate.Month);

        [NotMapped]
        public int TotalWorkExperienceYears => TotalWorkExperienceMonths / 12;

        [Required]
        public Gender Gender { get; set; }

        public virtual ICollection<Mission> Missions { get; set; } = [];

        public virtual ICollection<MissionAssignment> MissionAssignments { get; set; } = [];

        public virtual ICollection<Mission> CreatedMissions { get; set; } = [];
    }
}
