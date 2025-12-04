import { request } from './api';

/**
 * Deletes a post by its ID.
 * Requires authentication.
 * @param postId The ID of the post to delete.
 */
export const deletePost = async (postId: number): Promise<any> => {
  try {
    const response = await request({
      url: `/PostDelete/${postId}`,
      method: "DELETE",
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting post with ID ${postId}:`, error);
    throw error;
  }
};
