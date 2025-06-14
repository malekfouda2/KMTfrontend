using KmtBackend.Models.Enums;

namespace KmtBackend.DAL.Constants
{
    public static class LeaveConstants
    {
        #region Leave Types

        public const string RegularAnnualLeave = "Regular Annual Leave";

        public const string CasualLeave = "Casual Leave";

        //public const string SickLeave = "Sick Leave";

        //public const string MaternityLeave = "Maternity Leave";

        //public const string MarriageLeave = "Marriage Leave";

        //public const string BereavementLeave = "Bereavement Leave";

        //public const string PilgrimageLeave = "Pilgrimage Leave";

        public const string TwoHourExcuse = "Two Hour Excuse";

        #endregion


        #region Egyptian Labor Law Entitlement Rules

        //public const int SeniorityYearsThreshold = 10;

        public const int JuniorRegularLeaveDays = 15;

        //public const int SeniorRegularLeaveDays = 24;

        public const int JuniorCasualLeaveDays = 6;

        //public const int SeniorCasualLeaveDays = 6;

        //public const int SickLeaveDays = 180;

        //public const int MaternityLeaveDays = 90;

        //public const int BereavementLeaveDays = 3;

        //public const int MarriageLeaveDays = 3;

        //public const int PilgrimageLeaveDays = 30;

        public const int TwoHourExcuseDaysPerMonth = 1;

        public const int MonthsBeforeLeavesAreAvilable = 12;

        #endregion

        public static Dictionary<string, (string NameAr, string Description, string DescriptionAr, bool IsSeniorityBased, bool AllowCarryOver, bool IsGenderSpecific, Gender? ApplicableGender, bool IsLimitedFrequency, /*int? MinServiceMonths,*/ int? MaxUses)> GetAllLeaveTypes()
        {
            return new Dictionary<string, (string, string, string, bool, bool, bool, Gender?, bool, /*int?,*/ int?)>
            {
                [RegularAnnualLeave] = (
                    "إجازة اعتيادية",
                    "Regular annual leave based on seniority",
                    "الإجازة السنوية الاعتيادية حسب الأقدمية",
                    true,   // IsSeniorityBased
                    true,   // AllowCarryOver
                    false,  // IsGenderSpecific
                    null,   // ApplicableGender
                    false,  // IsLimitedFrequency
                    //12,   // MinServiceMonths
                    null    // MaxUses
                ),
                [CasualLeave] = (
                    "إجازة عارضة",
                    "Emergency leave for unexpected circumstances",
                    "إجازة طارئة للظروف غير المتوقعة",
                    false, false, false, null, false, /*12,*/ null
                ),
                //[SickLeave] = (
                //    "إجازة مرضية",
                //    "Leave for illness and medical reasons",
                //    "إجازة للمرض والأسباب الطبية",
                //    false, false, false, null, false, null, null
                //),
                //[MaternityLeave] = (
                //    "إجازة أمومة",
                //    "Leave for childbirth and recovery",
                //    "إجازة للولادة والتعافي",
                //    false,              // IsSeniorityBased
                //    false,              // AllowCarryOver
                //    true,               // IsGenderSpecific
                //    Gender.Female,      // ApplicableGender
                //    true,               // IsLimitedFrequency
                //    10,                  // MinServiceMonths (10 months)
                //    2                   // MaxUses (max 2 maternity leaves)
                //),
                //[MarriageLeave] = (
                //    "إجازة زواج",
                //    "Leave for employee's marriage",
                //    "إجازة لزواج الموظف",
                //    false, false, false, null, false, null, null
                //),
                //[BereavementLeave] = (
                //    "إجازة وفاة",
                //    "Compassionate leave for death of immediate family",
                //    "إجازة لوفاة أحد أفراد العائلة المباشرة",
                //    false, false, false, null, false, null, null
                //),
                //[PilgrimageLeave] = (
                //    "إجازة حج",
                //    "Leave for religious pilgrimage",
                //    "إجازة لأداء فريضة الحج",
                //    false,              // IsSeniorityBased
                //    false,              // AllowCarryOver
                //    false,              // IsGenderSpecific
                //    null,               // ApplicableGender
                //    true,               // IsLimitedFrequency
                //    60,                  // MinServiceMonths (5 years minimum service)
                //    1                   // MaxUses (only once per employer)
                //),
                [TwoHourExcuse] = (
                    "إذن ساعتين",
                    "Monthly two-hour excuse",
                    "إذن الساعتين الشهري",
                    false,  // IsSeniorityBased
                    false,  // AllowCarryOver
                    false,  // IsGenderSpecific
                    null,   // ApplicableGender
                    true,   // IsLimitedFrequency
                    //null,   // MinServiceMonths
                    1       // MaxUses per month
                )
            };
        }

        public static Dictionary<string, int> GetDefaultEntitlementDays()
        {
            return new Dictionary<string, int>
            {
                [RegularAnnualLeave] = JuniorRegularLeaveDays,
                [CasualLeave] = JuniorCasualLeaveDays,
                //[SickLeave] = SickLeaveDays,
                //[MaternityLeave] = MaternityLeaveDays,
                //[MarriageLeave] = MarriageLeaveDays,
                //[BereavementLeave] = BereavementLeaveDays,
                //[PilgrimageLeave] = PilgrimageLeaveDays,
                [TwoHourExcuse] = TwoHourExcuseDaysPerMonth
            };
        }
    }
}
