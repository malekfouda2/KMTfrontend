using KmtBackend.BLL.Managers.Interfaces;
using KmtBackend.DAL.Constants;
using KmtBackend.DAL.Entities;
using KmtBackend.DAL.Repositories;
using KmtBackend.DAL.Repositories.Interfaces;
using KmtBackend.Models.DTOs.Leave;
using KmtBackend.Models.Enums;
using MapsterMapper;

namespace KmtBackend.BLL.Managers
{
    public class LeaveBalanceManager : ILeaveBalanceManager
    {
        private readonly ILeaveBalanceRepository _leaveBalanceRepository;
        private readonly ILeaveTypeRepository _leaveTypeRepository;
        private readonly IUserRepository _userRepository;
        private readonly ILeaveRequestRepository _leaveRequestRepository;
        private readonly IMapper _mapper;

        public LeaveBalanceManager(
            ILeaveBalanceRepository leaveBalanceRepository,
            ILeaveTypeRepository leaveTypeRepository,
            IUserRepository userRepository,
            IMapper mapper,
            ILeaveRequestRepository leaveRequestRepository)
        {
            _leaveBalanceRepository = leaveBalanceRepository;
            _leaveTypeRepository = leaveTypeRepository;
            _userRepository = userRepository;
            _mapper = mapper;
            _leaveRequestRepository = leaveRequestRepository;
        }

        public async Task<LeaveBalanceResponse?> GetLeaveBalanceByIdAsync(Guid id)
        {
            var leaveBalance = await _leaveBalanceRepository.GetByIdAsync(id);
            if (leaveBalance == null) return null;
            
            return _mapper.Map<LeaveBalanceResponse>(leaveBalance);
        }

        public async Task<IEnumerable<LeaveBalanceResponse>> GetUserLeaveBalancesAsync(Guid userId, int? year)
        {
            var balances = await _leaveBalanceRepository.GetByUserIdAsync(userId, year);
                
            var responses = balances.Select(_mapper.Map<LeaveBalanceResponse>);

            return responses;
        }

        public async Task<LeaveBalanceResponse> UpdateLeaveBalanceAsync(Guid id, UpdateLeaveBalanceRequest request)
        {
            var leaveBalance = await _leaveBalanceRepository.GetByIdAsync(id);
            if (leaveBalance == null)
            {
                throw new KeyNotFoundException("Leave balance not found");
            }

            leaveBalance.TotalDays = request.TotalDays ?? leaveBalance.TotalDays;
            leaveBalance.UsedDays = request.UsedDays ?? leaveBalance.UsedDays;

            var updatedBalance = await _leaveBalanceRepository.UpdateAsync(leaveBalance);
            
            return _mapper.Map<LeaveBalanceResponse>(updatedBalance);
        }

        //public async Task<bool> CreateInitialBalancesForUserAsync(Guid userId)
        //{
        //    var user = await _userRepository.GetByIdAsync(userId) ?? throw new KeyNotFoundException("User not found");

        //    var currentYear = DateTime.Now.Year;

        //    var leaveTypes = await _leaveTypeRepository.GetAllAsync();

        //    foreach (var leaveType in leaveTypes)
        //    {
        //        int entitledDays = await CalculateEligibleLeaveDaysAsync(user, leaveType, currentYear);

        //        var balance = new LeaveBalance
        //        {
        //            Id = Guid.NewGuid(),
        //            UserId = user.Id,
        //            LeaveTypeId = leaveType.Id,
        //            Year = currentYear,
        //            TotalDays = entitledDays,
        //            UsedDays = 0,
        //            CreatedAt = DateTime.UtcNow
        //        };

        //        await _leaveBalanceRepository.CreateAsync(balance);
        //    }

        //    return true;
        //}

        public async Task<bool> CreateInitialBalancesForUserAsync(Guid userId)
        {
            var user = await _userRepository.GetByIdAsync(userId) ?? throw new KeyNotFoundException("User not found");
            var currentYear = DateTime.Now.Year;
            var leaveTypes = await _leaveTypeRepository.GetAllAsync();

            foreach (var leaveType in leaveTypes)
            {
                int entitledDays = await CalculateEligibleLeaveDaysAsync(user, leaveType, currentYear);

                DateTime notUsedBefore;

                if (leaveType.Name == LeaveConstants.TwoHourExcuse)
                {
                    // Two Hour Excuse is available immediately
                    notUsedBefore = user.HireDate;
                }
                else
                {
                    notUsedBefore = user.HireDate.AddMonths(LeaveConstants.MonthsBeforeLeavesAreAvilable);
                }

                var balance = new LeaveBalance
                {
                    Id = Guid.NewGuid(),
                    UserId = user.Id,
                    LeaveTypeId = leaveType.Id,
                    Year = currentYear,
                    TotalDays = entitledDays,
                    UsedDays = 0,
                    NotUsedBefore = notUsedBefore,
                    CreatedAt = DateTime.UtcNow
                };

                await _leaveBalanceRepository.CreateAsync(balance);
            }

            return true;
        }

        //public async Task<int> ResetAllUserBalancesAsync(int year)
        //{
        //    var users = await _userRepository.GetAllAsync();
        //    var activeUsers = users.Where(u => u.TerminationDate == null || u.TerminationDate > DateTime.UtcNow);

        //    int count = 0;

        //    foreach (var user in activeUsers)
        //    {
        //        // Get leave types
        //        var leaveTypes = await _leaveTypeRepository.GetAllAsync();

        //        foreach (var leaveType in leaveTypes)
        //        {
        //            // Check if balance already exists
        //            var existingBalance = await _leaveBalanceRepository.GetUserBalanceAsync(user.Id, leaveType.Id, year);

        //            int entitledDays = await CalculateEligibleLeaveDaysAsync(user, leaveType, year);

        //            if (existingBalance == null)
        //            {
        //                // Create new balance
        //                var balance = new LeaveBalance
        //                {
        //                    Id = Guid.NewGuid(),
        //                    UserId = user.Id,
        //                    LeaveTypeId = leaveType.Id,
        //                    Year = year,
        //                    TotalDays = entitledDays,
        //                    UsedDays = 0,
        //                    CreatedAt = DateTime.UtcNow
        //                };

        //                await _leaveBalanceRepository.CreateAsync(balance);
        //            }
        //            else
        //            {
        //                // Handle carry-over if applicable
        //                int carryOverDays = 0;

        //                //if (leaveType.AllowCarryOver && year > DateTime.Now.Year - 1)
        //                //{
        //                //    // Check previous year balance
        //                //    var previousYearBalance = await _leaveBalanceRepository.GetUserBalanceAsync(
        //                //        user.Id, leaveType.Id, year - 1);

        //                //    if (previousYearBalance != null && previousYearBalance.RemainingDays > 0)
        //                //    {
        //                //        carryOverDays = Math.Min(previousYearBalance.RemainingDays, 10); // Max 10 days carried over
        //                //    }
        //                //}

        //                // Update existing balance
        //                existingBalance.TotalDays = entitledDays + carryOverDays;
        //                existingBalance.UsedDays = 0;
        //                existingBalance.UpdatedAt = DateTime.UtcNow;

        //                await _leaveBalanceRepository.UpdateAsync(existingBalance);
        //            }

        //            count++;
        //        }
        //    }

        //    return count;
        //}

        public async Task<int> ResetAllUserBalancesAsync(int year)
        {
            var users = await _userRepository.GetAllAsync();
            var activeUsers = users.Where(u => u.TerminationDate == null || u.TerminationDate > DateTime.UtcNow);

            int count = 0;

            foreach (var user in activeUsers)
            {
                var leaveTypes = await _leaveTypeRepository.GetAllAsync();

                foreach (var leaveType in leaveTypes)
                {
                    var existingBalance = await _leaveBalanceRepository.GetUserBalanceAsync(user.Id, leaveType.Id, year);
                    int entitledDays = await CalculateEligibleLeaveDaysAsync(user, leaveType, year);

                    if (existingBalance == null)
                    {
                        DateTime notUsedBefore;

                        if (leaveType.Name == LeaveConstants.TwoHourExcuse)
                        {
                            // Two Hour Excuse is available immediately
                            notUsedBefore = user.HireDate;
                        }
                        else
                        {
                            notUsedBefore = user.HireDate.AddMonths(LeaveConstants.MonthsBeforeLeavesAreAvilable);
                        }

                        var balance = new LeaveBalance
                        {
                            Id = Guid.NewGuid(),
                            UserId = user.Id,
                            LeaveTypeId = leaveType.Id,
                            Year = year,
                            TotalDays = entitledDays,
                            UsedDays = 0,
                            NotUsedBefore = notUsedBefore,
                            CreatedAt = DateTime.UtcNow
                        };

                        await _leaveBalanceRepository.CreateAsync(balance);
                    }
                    else
                    {
                        existingBalance.TotalDays = entitledDays;
                        existingBalance.UsedDays = 0;
                        existingBalance.UpdatedAt = DateTime.UtcNow;

                        await _leaveBalanceRepository.UpdateAsync(existingBalance);
                    }

                    count++;
                }
            }

            return count;
        }


        private async Task<int> CalculateEligibleLeaveDaysAsync(User user, LeaveType leaveType, int year)
        {
            // For limited frequency leaves (like Two Hour Excuse)
            if (leaveType.IsLimitedFrequency && leaveType.MaxUses.HasValue)
            {
                // Count how many times this user has used this leave type
                int usedCount = await CountLeaveUsageAsync(user.Id, leaveType.Id);

                if (usedCount >= leaveType.MaxUses.Value)
                {
                    return 0; // Already used up the maximum allowed times
                }
            }

            // Get default entitlement days directly from constants
            var defaultEntitlements = LeaveConstants.GetDefaultEntitlementDays();
            if (defaultEntitlements.TryGetValue(leaveType.Name, out int days))
            {
                return days;
            }

            return 0;
        }

        //private async Task<int> CalculateEligibleLeaveDaysAsync(User user, LeaveType leaveType, int year)
        //{
        //    //if (leaveType.IsGenderSpecific && leaveType.ApplicableGender.HasValue && user.Gender != leaveType.ApplicableGender.Value)
        //    //{
        //    //    return 0; // Not eligible due to gender mismatch
        //    //}

        //    if (leaveType.MinServiceMonths.HasValue)
        //    {
        //        int serviceYears = CalculateServiceMonths(user);

        //        if (serviceYears < leaveType.MinServiceMonths.Value)
        //        {
        //            return 0; // Not eligible due to insufficient service
        //        }
        //    }

        //    if (leaveType.IsLimitedFrequency && leaveType.MaxUses.HasValue)
        //    {
        //        // Count how many times this user has used this leave type
        //        int usedCount = await CountLeaveUsageAsync(user.Id, leaveType.Id);

        //        if (usedCount >= leaveType.MaxUses.Value)
        //        {
        //            return 0; // Already used up the maximum allowed times
        //        }
        //    }

        //    //if (leaveType.IsSeniorityBased)
        //    //{
        //    //    // Calculate total work experience (including prior experience)
        //    //    int totalYearsExperience = user.TotalWorkExperienceYears;

        //    //    // Determine entitlement based on seniority
        //    //    if (leaveType.Name == LeaveConstants.RegularAnnualLeave)
        //    //    {
        //    //        return totalYearsExperience >= LeaveConstants.SeniorityYearsThreshold
        //    //            ? LeaveConstants.SeniorRegularLeaveDays
        //    //            : LeaveConstants.JuniorRegularLeaveDays;
        //    //    }
        //    //    else if (leaveType.Name == LeaveConstants.CasualLeave)
        //    //    {
        //    //        return totalYearsExperience >= LeaveConstants.SeniorityYearsThreshold
        //    //            ? LeaveConstants.SeniorCasualLeaveDays
        //    //            : LeaveConstants.JuniorCasualLeaveDays;
        //    //    }
        //    //}

        //    var defaultEntitlements = LeaveConstants.GetDefaultEntitlementDays();
        //    if (defaultEntitlements.TryGetValue(leaveType.Name, out int days))
        //    {
        //        return days;
        //    }

        //    return 0;
        //}

        private async Task<int> CountLeaveUsageAsync(Guid userId, Guid leaveTypeId)
        {
            var approvedRequests = await _leaveRequestRepository.GetByUserIdAsync(userId);
            return approvedRequests
                .Count(r => r.LeaveTypeId == leaveTypeId && r.Status == LeaveRequestStatus.Approved);
        }

        private static int CalculateServiceMonths(User user)
        {
            var today = DateTime.UtcNow;

            int monthsFromYears = (today.Year - user.HireDate.Year) * 12;

            int monthsDifference = today.Month - user.HireDate.Month;

            if (today.Day < user.HireDate.Day)
            {
                monthsDifference--;
            }

            return monthsFromYears + monthsDifference;
        }
    }
}