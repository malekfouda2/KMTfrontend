using KmtBackend.BLL.Managers.Interfaces;
using KmtBackend.DAL.Constants;
using KmtBackend.DAL.Entities;
using KmtBackend.DAL.Repositories;
using KmtBackend.DAL.Repositories.Interfaces;
using KmtBackend.Models.DTOs.Common;
using KmtBackend.Models.DTOs.Leave;
using KmtBackend.Models.Enums;
using MapsterMapper;
using Microsoft.AspNetCore.Http;

namespace KmtBackend.BLL.Managers
{
    public class LeaveRequestManager : ILeaveRequestManager
    {
        private readonly ILeaveRequestRepository _leaveRequestRepository;
        private readonly ILeaveBalanceRepository _leaveBalanceRepository;
        private readonly ILeaveTypeRepository _leaveTypeRepository;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public LeaveRequestManager(
            ILeaveRequestRepository leaveRequestRepository,
            ILeaveBalanceRepository leaveBalanceRepository,
            IUserRepository userRepository,
            IMapper mapper,
            IHttpContextAccessor httpContextAccessor,
            ILeaveTypeRepository leaveTypeRepository)
        {
            _leaveRequestRepository = leaveRequestRepository;
            _leaveBalanceRepository = leaveBalanceRepository;
            _userRepository = userRepository;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
            _leaveTypeRepository = leaveTypeRepository;
        }

        //public async Task<LeaveRequestResponse> CreateLeaveRequestAsync(Guid userId, CreateLeaveRequestRequest request)
        //{
        //    // Validate user exists
        //    var user = await _userRepository.GetByIdAsync(userId) ?? throw new KeyNotFoundException("User not found");

        //    // Get leave type
        //    var leaveType = await _leaveTypeRepository.GetByIdAsync(request.LeaveTypeId) ??
        //        throw new KeyNotFoundException("Leave type not found");

        //    int days;
        //    TimeSpan? startTime = null;
        //    TimeSpan? endTime = null;
        //    int? month = null;
        //    bool isHourlyLeave = false;

        //    // Two-Hour Excuse handling
        //    if (leaveType.Name == LeaveConstants.TwoHourExcuse)
        //    {
        //        if (!request.IsHourlyLeave || !request.StartTime.HasValue)
        //        {
        //            throw new InvalidOperationException("Start time must be provided for two-hour excuses");
        //        }

        //        isHourlyLeave = true;
        //        startTime = request.StartTime;
        //        endTime = startTime.Value.Add(TimeSpan.FromHours(2)); // Automatically calculate end time

        //        // Set current month for monthly tracking
        //        month = DateTime.Now.Month;

        //        // Check if user already used their excuse this month
        //        var existingExcuses = await _leaveRequestRepository.GetByUserIdAsync(userId);
        //        bool alreadyUsedThisMonth = existingExcuses.Any(r =>
        //            r.LeaveTypeId == request.LeaveTypeId &&
        //            r.Month == month &&
        //            r.StartDate.Year == DateTime.Now.Year &&
        //            (r.Status == LeaveRequestStatus.Approved || r.Status == LeaveRequestStatus.Pending));

        //        if (alreadyUsedThisMonth)
        //        {
        //            throw new InvalidOperationException($"You have already used or requested your two-hour excuse for this month");
        //        }

        //        // For two-hour excuses, we convert to days (0.25 days = 2 hours in an 8-hour workday)
        //        days = 1; // We'll keep days = 1 in DB but deduct 0.25 from regular leave balance when approved
        //    }
        //    else
        //    {
        //        // Regular leave handling
        //        days = (int)(request.EndDate.Date - request.StartDate.Date).TotalDays + 1;

        //        if (days <= 0)
        //        {
        //            throw new ArgumentException("End date must be after start date");
        //        }
        //    }

        //    // Get the user's leave balance for regular leaves
        //    var currentYear = DateTime.Now.Year;

        //    // For two-hour excuses, check regular leave balance instead of excuse balance
        //    Guid balanceLeaveTypeId = leaveType.Name == LeaveConstants.TwoHourExcuse ?
        //        (await _leaveTypeRepository.GetByNameAsync(LeaveConstants.RegularAnnualLeave))!.Id :
        //        request.LeaveTypeId;

        //    var leaveBalance = await _leaveBalanceRepository.GetUserBalanceAsync(userId, balanceLeaveTypeId, currentYear) ??
        //        throw new InvalidOperationException("No leave balance found for this leave type");

        //    // For two-hour excuses, check if user has at least 0.25 days of regular leave
        //    decimal requiredDays = leaveType.Name == LeaveConstants.TwoHourExcuse ? 0.25m : days;

        //    if (leaveBalance.RemainingDays < requiredDays && leaveType.Name == LeaveConstants.TwoHourExcuse)
        //    {
        //        throw new InvalidOperationException($"Insufficient regular leave balance for two-hour excuse");
        //    }
        //    else if (leaveBalance.RemainingDays < days)
        //    {
        //        throw new InvalidOperationException($"Insufficient leave balance. Available: {leaveBalance.RemainingDays}, Requested: {days}");
        //    }

        //    // Create the leave request
        //    var leaveRequest = new LeaveRequest
        //    {
        //        Id = Guid.NewGuid(),
        //        UserId = userId,
        //        LeaveTypeId = request.LeaveTypeId,
        //        StartDate = request.StartDate,
        //        EndDate = request.EndDate,
        //        Days = days,
        //        Status = LeaveRequestStatus.Pending,
        //        IsHourlyLeave = isHourlyLeave,
        //        StartTime = startTime,
        //        EndTime = endTime,
        //        Month = month,
        //        CreatedAt = DateTime.UtcNow
        //    };

        //    var createdRequest = await _leaveRequestRepository.CreateAsync(leaveRequest);

        //    return _mapper.Map<LeaveRequestResponse>(createdRequest);
        //}


        public async Task<LeaveRequestResponse> CreateLeaveRequestAsync(Guid userId, CreateLeaveRequestRequest request)
        {
            // Validate user exists
            var user = await _userRepository.GetByIdAsync(userId) ?? throw new KeyNotFoundException("User not found");

            // Get leave type
            var leaveType = await _leaveTypeRepository.GetByIdAsync(request.LeaveTypeId) ??
                throw new KeyNotFoundException("Leave type not found");

            int days;
            TimeSpan? startTime = null;
            TimeSpan? endTime = null;
            int? month = null;
            bool isHourlyLeave = false;

            // Two-Hour Excuse handling
            if (leaveType.Name == LeaveConstants.TwoHourExcuse)
            {
                if (!request.IsHourlyLeave || !request.StartTime.HasValue)
                {
                    throw new InvalidOperationException("Start time must be provided for two-hour excuses");
                }

                isHourlyLeave = true;
                startTime = request.StartTime;
                endTime = startTime.Value.Add(TimeSpan.FromHours(2)); // Automatically calculate end time

                // Set current month for monthly tracking
                month = DateTime.Now.Month;

                // Check if user already used their excuse this month
                var existingExcuses = await _leaveRequestRepository.GetByUserIdAsync(userId);
                bool alreadyUsedThisMonth = existingExcuses.Any(r =>
                    r.LeaveTypeId == request.LeaveTypeId &&
                    r.Month == month &&
                    r.StartDate.Year == DateTime.Now.Year &&
                    (r.Status == LeaveRequestStatus.Approved || r.Status == LeaveRequestStatus.Pending));

                if (alreadyUsedThisMonth)
                {
                    throw new InvalidOperationException($"You have already used or requested your two-hour excuse for this month");
                }

                days = 1; // We'll deduct 0.25 when approved
            }
            else
            {
                // Regular leave handling
                days = (int)(request.EndDate.Date - request.StartDate.Date).TotalDays + 1;

                if (days <= 0)
                {
                    throw new ArgumentException("End date must be after start date");
                }
            }

            // Get the user's leave balance
            var currentYear = DateTime.Now.Year;

            // For two-hour excuses, check regular leave balance instead of excuse balance
            Guid balanceLeaveTypeId = leaveType.Name == LeaveConstants.TwoHourExcuse ?
                (await _leaveTypeRepository.GetByNameAsync(LeaveConstants.RegularAnnualLeave))!.Id :
                request.LeaveTypeId;

            var leaveBalance = await _leaveBalanceRepository.GetUserBalanceAsync(userId, balanceLeaveTypeId, currentYear) ??
                throw new InvalidOperationException("No leave balance found for this leave type");

            // Check if the leave is available yet based on NotUsedBefore date
            if (request.StartDate < leaveBalance.NotUsedBefore)
            {
                throw new InvalidOperationException(
                    $"This leave balance is not available until {leaveBalance.NotUsedBefore.ToShortDateString()}");
            }

            // For two-hour excuses, check if user has at least 0.25 days of regular leave
            decimal requiredDays = leaveType.Name == LeaveConstants.TwoHourExcuse ? 0.25m : days;

            if (leaveBalance.RemainingDays < requiredDays)
            {
                throw new InvalidOperationException(
                    $"Insufficient leave balance. Available: {leaveBalance.RemainingDays}, Requested: {requiredDays}");
            }

            // Create the leave request
            var leaveRequest = new LeaveRequest
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                LeaveTypeId = request.LeaveTypeId,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                Days = days,
                Status = LeaveRequestStatus.Pending,
                IsHourlyLeave = isHourlyLeave,
                StartTime = startTime,
                EndTime = endTime,
                Month = month,
                CreatedAt = DateTime.UtcNow
            };

            var createdRequest = await _leaveRequestRepository.CreateAsync(leaveRequest);

            return _mapper.Map<LeaveRequestResponse>(createdRequest);
        }


        public async Task<LeaveRequestResponse?> GetLeaveRequestByIdAsync(Guid id)
        {
            var leaveRequest = await _leaveRequestRepository.GetByIdAsync(id);
            if (leaveRequest == null) return null;
            
            return _mapper.Map<LeaveRequestResponse>(leaveRequest);
        }

        public async Task<PaginatedResult<LeaveRequestResponse>> GetUserLeaveRequestsPaginatedAsync(Guid userId, PaginationQuery pagination)
        {
            var result = await _leaveRequestRepository.GetByUserIdPaginatedAsync(userId, pagination);
            
            var responses = _mapper.Map<IEnumerable<LeaveRequestResponse>>(result.Items).ToList();
            
            return new PaginatedResult<LeaveRequestResponse>
            {
                Items = responses,
                PageNumber = result.PageNumber,
                PageSize = result.PageSize,
                TotalRecords = result.TotalRecords
            };
        }

        public async Task<PaginatedResult<LeaveRequestResponse>> GetDepartmentLeaveRequestsPaginatedAsync(Guid departmentId, PaginationQuery pagination)
        {
            var result = await _leaveRequestRepository.GetByDepartmentIdPaginatedAsync(departmentId, pagination);
            
            var responses = _mapper.Map<IEnumerable<LeaveRequestResponse>>(result.Items).ToList();
            
            return new PaginatedResult<LeaveRequestResponse>
            {
                Items = responses,
                PageNumber = result.PageNumber,
                PageSize = result.PageSize,
                TotalRecords = result.TotalRecords
            };
        }

        public async Task<PaginatedResult<LeaveRequestResponse>> GetAllLeaveRequestsPaginatedAsync(PaginationQuery pagination)
        {
            var result = await _leaveRequestRepository.GetAllPaginatedAsync(pagination);
            
            var responses = _mapper.Map<IEnumerable<LeaveRequestResponse>>(result.Items).ToList();
            
            return new PaginatedResult<LeaveRequestResponse>
            {
                Items = responses,
                PageNumber = result.PageNumber,
                PageSize = result.PageSize,
                TotalRecords = result.TotalRecords
            };
        }

        public async Task<LeaveRequestResponse> ApproveLeaveRequestAsync(Guid id)
        {
            var leaveRequest = await _leaveRequestRepository.GetByIdAsync(id) ?? throw new KeyNotFoundException("Leave request not found");

            if (leaveRequest.Status != LeaveRequestStatus.Pending)
            {
                throw new InvalidOperationException("Only pending requests can be approved");
            }

            // Get the leave type
            var leaveType = leaveRequest.LeaveType;

            // Get the leave balance
            var currentYear = leaveRequest.StartDate.Year; // Use the year of the leave date

            // For two-hour excuses, deduct from regular leave balance
            Guid balanceLeaveTypeId = leaveType.Name == LeaveConstants.TwoHourExcuse ?
                (await _leaveTypeRepository.GetByNameAsync(LeaveConstants.RegularAnnualLeave))!.Id :
                leaveRequest.LeaveTypeId;

            var leaveBalance = await _leaveBalanceRepository.GetUserBalanceAsync(
                leaveRequest.UserId, balanceLeaveTypeId, currentYear)
                ?? throw new InvalidOperationException("No leave balance found for this leave type");

            // For two-hour excuses, we deduct 0.25 days from regular leave
            int daysToDeduct = leaveType.Name == LeaveConstants.TwoHourExcuse ? 1 : leaveRequest.Days;

            // Check if user still has enough balance
            if (leaveBalance.RemainingDays < daysToDeduct)
            {
                throw new InvalidOperationException($"Insufficient leave balance. Available: {leaveBalance.RemainingDays}, Requested: {daysToDeduct}");
            }

            // Update the leave request
            var processedById = _httpContextAccessor.HttpContext?.User.FindFirst("sub")?.Value!;
            leaveRequest.Status = LeaveRequestStatus.Approved;
            leaveRequest.ProcessedById = Guid.Parse(processedById);
            leaveRequest.ProcessedDate = DateTime.UtcNow;

            var updatedRequest = await _leaveRequestRepository.UpdateAsync(leaveRequest);

            // Deduct from leave balance - for two-hour excuses deduct 0.25 from regular leave
            if (leaveType.Name == LeaveConstants.TwoHourExcuse)
            {
                leaveBalance.UsedDays += 0.25m; // Deduct 0.25 days
            }
            else
            {
                leaveBalance.UsedDays += leaveRequest.Days;
            }

            await _leaveBalanceRepository.UpdateAsync(leaveBalance);

            return _mapper.Map<LeaveRequestResponse>(updatedRequest);
        }


        public async Task<LeaveRequestResponse> RejectLeaveRequestAsync(Guid id, RejectLeaveRequestRequest request)
        {
            var leaveRequest = await _leaveRequestRepository.GetByIdAsync(id);
            if (leaveRequest == null)
            {
                throw new KeyNotFoundException("Leave request not found");
            }
            
            if (leaveRequest.Status != LeaveRequestStatus.Pending)
            {
                throw new InvalidOperationException("Only pending requests can be rejected");
            }

            // Update the leave request
            var processedById = _httpContextAccessor.HttpContext?.User.FindFirst("sub")?.Value!;
            leaveRequest.Status = LeaveRequestStatus.Rejected;
            leaveRequest.ProcessedById = Guid.Parse(processedById);
            leaveRequest.ProcessedDate = DateTime.UtcNow;
            leaveRequest.RejectionReason = request.RejectionReason;
            
            var updatedRequest = await _leaveRequestRepository.UpdateAsync(leaveRequest);
            
            return _mapper.Map<LeaveRequestResponse>(updatedRequest);
        }

        public async Task<bool> CancelLeaveRequestAsync(Guid id)
        {
            var leaveRequest = await _leaveRequestRepository.GetByIdAsync(id);
            if (leaveRequest == null)
            {
                throw new KeyNotFoundException("Leave request not found");
            }
            var userId = _httpContextAccessor.HttpContext?.User.FindFirst("sub")?.Value!;
            // Only the request owner can cancel it
            if (leaveRequest.UserId.ToString() != userId)
            {
                throw new UnauthorizedAccessException("You can only cancel your own leave requests");
            }
            
            // Only pending requests can be canceled by the user
            if (leaveRequest.Status != LeaveRequestStatus.Pending)
            {
                throw new InvalidOperationException("Only pending requests can be canceled");
            }
            
            leaveRequest.Status = LeaveRequestStatus.Canceled;
            leaveRequest.UpdatedAt = DateTime.UtcNow;
            
            await _leaveRequestRepository.UpdateAsync(leaveRequest);
            
            return true;
        }
    }
}