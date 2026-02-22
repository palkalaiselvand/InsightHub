using InsightHubApi.DTOs;
using InsightHubApi.Models;
using InsightHubApi.Repositories;

namespace InsightHubApi.Services;

public class PostService : IPostService
{
    private readonly IPostRepository _postRepository;

    public PostService(IPostRepository postRepository)
    {
        _postRepository = postRepository;
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
