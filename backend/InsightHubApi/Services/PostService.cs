using InsightHubApi.DTOs;
using InsightHubApi.Models;
using InsightHubApi.Repositories;

namespace InsightHubApi.Services;

public class PostService : IPostService
{
    private readonly IPostRepository _postRepository;
    private readonly ICategoryRepository _categoryRepository;
    private readonly IUserRepository _userRepository;

    public PostService(
        IPostRepository postRepository,
        ICategoryRepository categoryRepository,
        IUserRepository userRepository
    )
    {
        _postRepository = postRepository;
        _categoryRepository = categoryRepository;
        _userRepository = userRepository;
    }

    public async Task<PostResponseDto> CreateAsync(CreatePostRequestDto request)
    {
        var post = new Post
        {
            Title = request.Title.Trim(),
            Content = request.Content,
            CategoryId = request.CategoryId,
            AuthorId = request.AuthorId,
            Status = request.Status
        };

        var created = await _postRepository.CreateAsync(post);
        return ToDto(created);
    }

    public async Task<PostResponseDto?> GetByIdAsync(string id)
    {
        var post = await _postRepository.GetByIdAsync(id);
        return post is null ? null : ToDto(post);
    }

    public async Task<List<PostResponseDto>> GetAllAsync()
    {
        var posts = await _postRepository.GetAllAsync();
        return posts.Select(ToDto).ToList();
    }

    public async Task<List<ReaderPostDto>> GetPublishedAsync(string? categoryId = null)
    {
        var posts = await _postRepository.GetPublishedAsync(categoryId);
        return await EnrichReaderPosts(posts);
    }

    public async Task<ReaderPostDto?> GetPublishedByIdAsync(string id)
    {
        var post = await _postRepository.GetByIdAsync(id);
        if (post is null || post.Status != "Published")
        {
            return null;
        }

        var enriched = await EnrichReaderPosts([post]);
        return enriched.FirstOrDefault();
    }

    public async Task<PostResponseDto?> UpdateAsync(string id, UpdatePostRequestDto request)
    {
        var updated = await _postRepository.UpdateAsync(
            id,
            new Post
            {
                Title = request.Title.Trim(),
                Content = request.Content,
                CategoryId = request.CategoryId,
                Status = request.Status
            }
        );

        return updated is null ? null : ToDto(updated);
    }

    public async Task<bool> DeleteAsync(string id)
    {
        return await _postRepository.DeleteAsync(id);
    }

    private async Task<List<ReaderPostDto>> EnrichReaderPosts(List<Post> posts)
    {
        var categories = await _categoryRepository.GetAllAsync();
        var users = await _userRepository.GetAllAsync();

        var categoryMap = categories.ToDictionary(c => c.Id, c => c.Name);
        var authorMap = users.ToDictionary(u => u.Id, u => u.Name);

        return posts.Select(post => new ReaderPostDto(
            post.Id,
            post.Title,
            post.Content,
            post.CategoryId,
            categoryMap.GetValueOrDefault(post.CategoryId, "Unknown Category"),
            post.AuthorId,
            authorMap.GetValueOrDefault(post.AuthorId, "Unknown Author"),
            post.Status,
            post.CreatedAt
        )).ToList();
    }

    private static PostResponseDto ToDto(Post post)
    {
        return new PostResponseDto(
            post.Id,
            post.Title,
            post.Content,
            post.CategoryId,
            post.AuthorId,
            post.Status,
            post.CreatedAt
        );
    }
}
