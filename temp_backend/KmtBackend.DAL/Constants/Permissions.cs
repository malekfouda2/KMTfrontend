namespace KmtBackend.DAL.Constants
{
    public static class Permissions
    {
        #region User Permissions

        public const string ViewUsers = "users.view";
        public const string CreateUsers = "users.create";
        public const string UpdateUsers = "users.update";
        public const string DeleteUsers = "users.delete";

        #endregion

        #region Department Permissions

        public const string ViewDepartments = "departments.view";
        public const string CreateDepartments = "departments.create";
        public const string UpdateDepartments = "departments.update";
        public const string DeleteDepartments = "departments.delete";

        #endregion

        #region Title Permissions

        public const string ViewTitles = "titles.view";
        public const string CreateTitles = "titles.create";
        public const string UpdateTitles = "titles.update";
        public const string DeleteTitles = "titles.delete";

        #endregion

        #region Role Permissions

        public const string ViewRoles = "roles.view";
        public const string CreateRoles = "roles.create";
        public const string UpdateRoles = "roles.update";
        public const string DeleteRoles = "roles.delete";
        public const string AssignRoles = "roles.assign";

        #endregion

        #region Permission Management

        public const string ViewPermissions = "permissions.view";
        public const string AssignPermissions = "permissions.assign";

        #endregion

        #region Mission Management Permissions

        public const string ViewMissions = "missions.view";
        public const string CreateMissions = "missions.create";
        public const string UpdateMissions = "missions.update";
        public const string DeleteMissions = "missions.delete";
        public const string AssignToMissions = "missions.assign";
        public const string UpdateMissionTransportation = "missions.transportation.update";

        #endregion

        public static IEnumerable<string> GetAllPermissions()
        {
            return
            [
                ViewUsers,
                CreateUsers,
                UpdateUsers,
                DeleteUsers,

                ViewDepartments,
                CreateDepartments,
                UpdateDepartments,
                DeleteDepartments,

                ViewTitles,
                CreateTitles,
                UpdateTitles,
                DeleteTitles,

                ViewRoles,
                CreateRoles,
                UpdateRoles,
                DeleteRoles,
                AssignRoles,

                ViewPermissions,
                AssignPermissions,

                ViewMissions,
                CreateMissions,
                UpdateMissions,
                DeleteMissions,
                AssignToMissions,
                UpdateMissionTransportation
            ];
        }

        public static Dictionary<string, (string Description, string DescriptionAr)> GetAllPermissionsWithDescriptions()
        {
            return new Dictionary<string, (string, string)>
            {
                [ViewUsers] = ("View all users", "عرض جميع المستخدمين"),
                [CreateUsers] = ("Create new users", "إنشاء مستخدمين جدد"),
                [UpdateUsers] = ("Update existing users", "تحديث المستخدمين الحاليين"),
                [DeleteUsers] = ("Delete users", "حذف المستخدمين"),

                [ViewDepartments] = ("View all departments", "عرض جميع الأقسام"),
                [CreateDepartments] = ("Create new departments", "إنشاء أقسام جديدة"),
                [UpdateDepartments] = ("Update existing departments", "تحديث الأقسام الحالية"),
                [DeleteDepartments] = ("Delete departments", "حذف الأقسام"),

                [ViewTitles] = ("View all titles", "عرض جميع الوظائف"),
                [CreateTitles] = ("Create new titles", "إنشاء وظائف جديدة"),
                [UpdateTitles] = ("Update existing titles", "تحديث الوظائف الحالية"),
                [DeleteTitles] = ("Delete titles", "حذف الوظائف"),

                [ViewRoles] = ("View all roles", "عرض جميع الأدوار"),
                [CreateRoles] = ("Create new roles", "إنشاء أدوار جديدة"),
                [UpdateRoles] = ("Update existing roles", "تحديث الأدوار الحالية"),
                [DeleteRoles] = ("Delete roles", "حذف الأدوار"),
                [AssignRoles] = ("Assign roles to users", "تعيين الأدوار للمستخدمين"),

                [ViewPermissions] = ("View all permissions", "عرض جميع الصلاحيات"),
                [AssignPermissions] = ("Assign permissions to roles", "تعيين الصلاحيات للأدوار"),

                [ViewMissions] = ("View all missions", "عرض جميع المهام"),
                [CreateMissions] = ("Create new missions", "إنشاء مهام جديدة"),
                [UpdateMissions] = ("Update existing missions", "تحديث المهام الحالية"),
                [DeleteMissions] = ("Delete missions", "حذف المهام"),
                [AssignToMissions] = ("Assign users to missions", "تعيين المستخدمين إلى المهام"),
                [UpdateMissionTransportation] = ("Update mission transportation", "تحديث وسيلة التنقل للمهام")
            };
        }
    }
}