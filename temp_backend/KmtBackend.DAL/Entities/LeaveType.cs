using KmtBackend.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace KmtBackend.DAL.Entities
{
    public class LeaveType : BaseEntity
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = null!;

        [Required]
        [MaxLength(100)]
        public string NameAr { get; set; } = null!;

        [MaxLength(250)]
        public string? Description { get; set; }

        [MaxLength(250)]
        public string? DescriptionAr { get; set; }

        public bool IsSeniorityBased { get; set; }

        public bool AllowCarryOver { get; set; }

        public bool IsGenderSpecific { get; set; }

        public Gender? ApplicableGender { get; set; }

        public bool IsLimitedFrequency { get; set; }

        //public int? MinServiceMonths { get; set; }

        public int? MaxUses { get; set; }

        // Navigation properties
        public virtual ICollection<LeaveBalance> LeaveBalances { get; set; } = [];
    }
}
