using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KmtBackend.DAL.Migrations
{
    /// <inheritdoc />
    public partial class RemoveMinServiceMonthsFromLeaveBalance : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MinServiceMonths",
                table: "LeaveTypes");

            migrationBuilder.AddColumn<DateTime>(
                name: "NotUsedBefore",
                table: "LeaveBalances",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NotUsedBefore",
                table: "LeaveBalances");

            migrationBuilder.AddColumn<int>(
                name: "MinServiceMonths",
                table: "LeaveTypes",
                type: "int",
                nullable: true);
        }
    }
}
