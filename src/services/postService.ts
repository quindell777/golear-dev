// src/services/postService.ts


/**
 * Deletes a post by its ID.
 * Requires authentication.
 * @param postId The ID of the post to delete.
 */
export const deletePost = async (postId: number): Promise<any> => {
  // O endpoint DELETE /posts/:id não está documentado na API.
  // A funcionalidade foi desativada temporariamente no frontend para evitar erros.
  // O código da requisição original foi mantido comentado para referência futura.
  throw new Error(`A funcionalidade de deletar posts (ID: ${postId}) não está implementada no backend.`);

  /*
  try {
    const response = await request({
      url: `/posts/${postId}`,
      method: "DELETE",
      withAuth: true,
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting post with ID ${postId}:`, error);
    throw error;
  }
  */
};
