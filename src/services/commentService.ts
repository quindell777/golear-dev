// src/services/commentService.ts
import { request } from './api';

/**
 * Deletes a comment by its ID.
 * Requires authentication.
 * @param postId The ID of the post the comment belongs to.
 * @param commentId The ID of the comment to delete.
 */
export const deleteComment = async (postId: number, commentId: number): Promise<any> => {
  try {
    const response = await request({
      url: `/posts/${postId}/comentarios/${commentId}`,
      method: "DELETE",
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting comment with ID ${commentId} from post with ID ${postId}:`, error);
    throw error;
  }
};
