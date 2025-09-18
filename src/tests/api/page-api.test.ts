import { test, expect } from '@playwright/test';
import { PageType } from '../../types/enums';

test.describe('Page API Tests', () => {
  test('should create page via API', async ({ request }) => {
    const response = await request.post('/api/pages', {
      data: {
        title: 'Test Page via API',
        type: PageType.CUSTOM,
        content: '<h1>Test Content</h1>'
      }
    });

    expect(response.status()).toBe(201);
    
    const responseData = await response.json();
    expect(responseData).toHaveProperty('id');
    expect(responseData.title).toBe('Test Page via API');
    expect(responseData.type).toBe(PageType.CUSTOM);
  });

  test('should get page via API', async ({ request }) => {
    // First create a page
    const createResponse = await request.post('/api/pages', {
      data: {
        title: 'Test Page for Get',
        type: PageType.CUSTOM,
        content: '<h1>Test Content</h1>'
      }
    });

    expect(createResponse.status()).toBe(201);
    const createdPage = await createResponse.json();

    // Then get the page
    const getResponse = await request.get(`/api/pages/${createdPage.id}`);
    
    expect(getResponse.status()).toBe(200);
    
    const pageData = await getResponse.json();
    expect(pageData.id).toBe(createdPage.id);
    expect(pageData.title).toBe('Test Page for Get');
  });

  test('should update page via API', async ({ request }) => {
    // First create a page
    const createResponse = await request.post('/api/pages', {
      data: {
        title: 'Test Page for Update',
        type: PageType.CUSTOM,
        content: '<h1>Original Content</h1>'
      }
    });

    expect(createResponse.status()).toBe(201);
    const createdPage = await createResponse.json();

    // Then update the page
    const updateResponse = await request.put(`/api/pages/${createdPage.id}`, {
      data: {
        title: 'Updated Page Title',
        content: '<h1>Updated Content</h1>'
      }
    });

    expect(updateResponse.status()).toBe(200);
    
    const updatedPage = await updateResponse.json();
    expect(updatedPage.title).toBe('Updated Page Title');
    expect(updatedPage.content).toBe('<h1>Updated Content</h1>');
  });

  test('should delete page via API', async ({ request }) => {
    // First create a page
    const createResponse = await request.post('/api/pages', {
      data: {
        title: 'Test Page for Delete',
        type: PageType.CUSTOM,
        content: '<h1>Test Content</h1>'
      }
    });

    expect(createResponse.status()).toBe(201);
    const createdPage = await createResponse.json();

    // Then delete the page
    const deleteResponse = await request.delete(`/api/pages/${createdPage.id}`);
    
    expect(deleteResponse.status()).toBe(204);

    // Verify page is deleted by trying to get it
    const getResponse = await request.get(`/api/pages/${createdPage.id}`);
    expect(getResponse.status()).toBe(404);
  });

  test('should list pages via API', async ({ request }) => {
    const response = await request.get('/api/pages');
    
    expect(response.status()).toBe(200);
    
    const pages = await response.json();
    expect(Array.isArray(pages)).toBe(true);
    
    // Each page should have required properties
    if (pages.length > 0) {
      const page = pages[0];
      expect(page).toHaveProperty('id');
      expect(page).toHaveProperty('title');
      expect(page).toHaveProperty('type');
    }
  });

  test('should publish page via API', async ({ request }) => {
    // First create a page
    const createResponse = await request.post('/api/pages', {
      data: {
        title: 'Test Page for Publish',
        type: PageType.CUSTOM,
        content: '<h1>Test Content</h1>'
      }
    });

    expect(createResponse.status()).toBe(201);
    const createdPage = await createResponse.json();

    // Then publish the page
    const publishResponse = await request.post(`/api/pages/${createdPage.id}/publish`);
    
    expect(publishResponse.status()).toBe(200);
    
    const publishedPage = await publishResponse.json();
    expect(publishedPage.status).toBe('published');
  });

  test('should unpublish page via API', async ({ request }) => {
    // First create and publish a page
    const createResponse = await request.post('/api/pages', {
      data: {
        title: 'Test Page for Unpublish',
        type: PageType.CUSTOM,
        content: '<h1>Test Content</h1>'
      }
    });

    expect(createResponse.status()).toBe(201);
    const createdPage = await createResponse.json();

    const publishResponse = await request.post(`/api/pages/${createdPage.id}/publish`);
    expect(publishResponse.status()).toBe(200);

    // Then unpublish the page
    const unpublishResponse = await request.post(`/api/pages/${createdPage.id}/unpublish`);
    
    expect(unpublishResponse.status()).toBe(200);
    
    const unpublishedPage = await unpublishResponse.json();
    expect(unpublishedPage.status).toBe('draft');
  });

  test('should duplicate page via API', async ({ request }) => {
    // First create a page
    const createResponse = await request.post('/api/pages', {
      data: {
        title: 'Test Page for Duplicate',
        type: PageType.CUSTOM,
        content: '<h1>Test Content</h1>'
      }
    });

    expect(createResponse.status()).toBe(201);
    const createdPage = await createResponse.json();

    // Then duplicate the page
    const duplicateResponse = await request.post(`/api/pages/${createdPage.id}/duplicate`);
    
    expect(duplicateResponse.status()).toBe(201);
    
    const duplicatedPage = await duplicateResponse.json();
    expect(duplicatedPage.title).toContain('Test Page for Duplicate');
    expect(duplicatedPage.id).not.toBe(createdPage.id);
  });

  test('should get page analytics via API', async ({ request }) => {
    // First create a page
    const createResponse = await request.post('/api/pages', {
      data: {
        title: 'Test Page for Analytics',
        type: PageType.CUSTOM,
        content: '<h1>Test Content</h1>'
      }
    });

    expect(createResponse.status()).toBe(201);
    const createdPage = await createResponse.json();

    // Then get page analytics
    const analyticsResponse = await request.get(`/api/pages/${createdPage.id}/analytics`);
    
    expect(analyticsResponse.status()).toBe(200);
    
    const analytics = await analyticsResponse.json();
    expect(analytics).toHaveProperty('views');
    expect(analytics).toHaveProperty('conversions');
    expect(analytics).toHaveProperty('conversionRate');
  });

  test('should handle API errors gracefully', async ({ request }) => {
    // Try to get a non-existent page
    const response = await request.get('/api/pages/999999');
    
    expect(response.status()).toBe(404);
    
    const errorData = await response.json();
    expect(errorData).toHaveProperty('error');
    expect(errorData.error).toContain('not found');
  });
});
