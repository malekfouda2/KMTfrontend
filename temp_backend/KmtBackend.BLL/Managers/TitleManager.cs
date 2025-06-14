using KmtBackend.BLL.Managers.Interfaces;
using KmtBackend.DAL.Entities;
using KmtBackend.DAL.Repositories;
using KmtBackend.DAL.Repositories.Interfaces;
using KmtBackend.Models.DTOs.Common;
using KmtBackend.Models.DTOs.Role;
using KmtBackend.Models.DTOs.Title;
using MapsterMapper;

namespace KmtBackend.BLL.Managers
{
    public class TitleManager : ITitleManager
    {
        private readonly ITitleRepository _titleRepository;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public TitleManager(
            ITitleRepository titleRepository,
            IUserRepository userRepository,
            IMapper mapper)
        {
            _titleRepository = titleRepository;
            _userRepository = userRepository;
            _mapper = mapper;
        }

        public async Task<TitleResponse?> GetTitleByIdAsync(Guid id)
        {
            var title = await _titleRepository.GetByIdAsync(id);
            
            if (title == null) return null;
            
            var response = _mapper.Map<TitleResponse>(title);
            
            var users = await _userRepository.GetByTitleAsync(id);
            response.UserCount = users.Count();
            
            return response;
        }

        public async Task<IEnumerable<TitleResponse>> GetAllTitlesAsync()
        {
            var titles = await _titleRepository.GetAllAsync();
            
            var responses = _mapper.Map<IEnumerable<TitleResponse>>(titles).ToList();
            
            var allUsers = await _userRepository.GetAllAsync();
            
            foreach (var response in responses)
            {
                response.UserCount = allUsers.Count(u => u.TitleId == response.Id);
            }
            
            return responses;
        }

        public async Task<PaginatedResult<TitleResponse>> GetAllTitlesPaginatedAsync(PaginationQuery pagination)
        {
            var roles = await _titleRepository.GetAllPaginatedAsync(pagination);

            var responses = _mapper.Map<IEnumerable<TitleResponse>>(roles.Items).ToList();

            var allUsers = await _userRepository.GetAllAsync();

            foreach (var response in responses)
            {
                response.UserCount = allUsers.Count(u => u.TitleId == response.Id);
            }

            return new PaginatedResult<TitleResponse>
            {
                Items = responses,
                PageNumber = roles.PageNumber,
                PageSize = roles.PageSize,
                TotalRecords = roles.TotalRecords
            };
        }

        public async Task<TitleResponse> CreateTitleAsync(CreateTitleRequest request)
        {
            var title = new Title
            {
                Name = request.Name,
                NameAr = request.NameAr,
                Description = request.Description,
                DescriptionAr = request.DescriptionAr,
                CreatedAt = DateTime.UtcNow
            };
            
            var createdTitle = await _titleRepository.CreateAsync(title);
            
            var response = _mapper.Map<TitleResponse>(createdTitle);
            
            response.UserCount = 0;
            
            return response;
        }

        public async Task<TitleResponse> UpdateTitleAsync(Guid id, UpdateTitleRequest request)
        {
            var title = await _titleRepository.GetByIdAsync(id) ?? throw new Exception("Title not found");
            title.Name = request.Name ?? title.Name;
            title.NameAr = request.NameAr ?? title.NameAr;
            title.Description = request.Description ?? title.Description;
            title.DescriptionAr = request.DescriptionAr ?? title.DescriptionAr;
            title.UpdatedAt = DateTime.UtcNow;
            
            var updatedTitle = await _titleRepository.UpdateAsync(title);
            
            var response = _mapper.Map<TitleResponse>(updatedTitle);
            
            var users = await _userRepository.GetByTitleAsync(id);
            response.UserCount = users.Count();
            
            return response;
        }

        public async Task<bool> DeleteTitleAsync(Guid id)
        {
            var users = await _userRepository.GetByTitleAsync(id);
            
            if (users.Any())
            {
                throw new Exception("Cannot delete title with assigned users");
            }
            
            return await _titleRepository.DeleteAsync(id);
        }
    }
}

