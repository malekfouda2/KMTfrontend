using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KmtBackend.DAL.Migrations
{
    /// <inheritdoc />
    public partial class AdjustDaysInLeaveEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<TimeSpan>(
                name: "EndTime",
                table: "LeaveRequests",
                type: "time",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsHourlyLeave",
                table: "LeaveRequests",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "Month",
                table: "LeaveRequests",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<TimeSpan>(
                name: "StartTime",
                table: "LeaveRequests",
                type: "time",
                nullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "UsedDays",
                table: "LeaveBalances",
                type: "decimal(5,2)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EndTime",
                table: "LeaveRequests");

            migrationBuilder.DropColumn(
                name: "IsHourlyLeave",
                table: "LeaveRequests");

            migrationBuilder.DropColumn(
                name: "Month",
                table: "LeaveRequests");

            migrationBuilder.DropColumn(
                name: "StartTime",
                table: "LeaveRequests");

            migrationBuilder.AlterColumn<int>(
                name: "UsedDays",
                table: "LeaveBalances",
                type: "int",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(5,2)");
        }
    }
}
