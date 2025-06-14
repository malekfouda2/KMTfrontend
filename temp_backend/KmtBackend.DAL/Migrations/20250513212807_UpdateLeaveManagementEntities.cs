using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KmtBackend.DAL.Migrations
{
    /// <inheritdoc />
    public partial class UpdateLeaveManagementEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Gender",
                table: "Users",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ApplicableGender",
                table: "LeaveTypes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsGenderSpecific",
                table: "LeaveTypes",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsLimitedFrequency",
                table: "LeaveTypes",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "MaxUses",
                table: "LeaveTypes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MinServiceMonths",
                table: "LeaveTypes",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Gender",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "ApplicableGender",
                table: "LeaveTypes");

            migrationBuilder.DropColumn(
                name: "IsGenderSpecific",
                table: "LeaveTypes");

            migrationBuilder.DropColumn(
                name: "IsLimitedFrequency",
                table: "LeaveTypes");

            migrationBuilder.DropColumn(
                name: "MaxUses",
                table: "LeaveTypes");

            migrationBuilder.DropColumn(
                name: "MinServiceMonths",
                table: "LeaveTypes");
        }
    }
}
