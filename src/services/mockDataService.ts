import { Post } from '@/types';
import { generateId } from '@/utils/helpers';
import { FEED_POST_COUNT, INITIAL_FEED_COUNT } from '@/utils/constants';

const MOCK_USERS = [
  { id: 'user-1', username: 'alex_creative', avatar: undefined },
  { id: 'user-2', username: 'sarah_designs', avatar: undefined },
  { id: 'user-3', username: 'mike_dev', avatar: undefined },
  { id: 'user-4', username: 'emma_photos', avatar: undefined },
  { id: 'user-5', username: 'jordan_travels', avatar: undefined },
];

const MOCK_DESCRIPTIONS = [
  'Just finished an amazing hike! The views were absolutely breathtaking 🏔️',
  'Working on a new design project. Can\'t wait to share the final result!',
  'Coffee and code — the perfect morning combo ☕💻',
  'Sunset vibes from last night. Nature never disappoints 🌅',
  'Excited to announce my new photography collection is live!',
  'Weekend brunch with friends. Life is good! 🥑',
  'Learning React Native has been such a rewarding journey.',
  'Throwback to my favorite travel destination this year ✈️',
  'New recipe experiment in the kitchen — turned out delicious!',
  'Grateful for this community and all the support 🙏',
];

export const generateMockPosts = (count: number, offset = 0): Post[] => {
  const posts: Post[] = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const index = (offset + i) % MOCK_USERS.length;
    const user = MOCK_USERS[index];
    const descIndex = (offset + i) % MOCK_DESCRIPTIONS.length;
    const hoursAgo = (offset + i) * 2 + 1;

    posts.push({
      id: generateId(),
      authorId: user.id,
      authorUsername: user.username,
      authorAvatar: user.avatar,
      description: MOCK_DESCRIPTIONS[descIndex],
      imageUri: (offset + i) % 3 === 0 ? `https://picsum.photos/seed/${offset + i}/600/400` : undefined,
      likes: Array.from({ length: Math.floor(Math.random() * 50) }, (_, j) => `like-user-${j}`),
      comments: [],
      createdAt: new Date(now - hoursAgo * 3600000).toISOString(),
    });
  }

  return posts;
};

export const getInitialPosts = (): Post[] => generateMockPosts(INITIAL_FEED_COUNT);

export const getDefaultPosts = getInitialPosts;

const MOCK_AUTHOR_IDS = new Set([
  'user-1',
  'user-2',
  'user-3',
  'user-4',
  'user-5',
]);

export const extractUserCreatedPosts = (posts: Post[]): Post[] =>
  posts.filter((post) => !MOCK_AUTHOR_IDS.has(post.authorId));

export const buildInitialFeed = (existingPosts: Post[] | null): Post[] => {
  const userPosts = existingPosts ? extractUserCreatedPosts(existingPosts) : [];
  return [...userPosts, ...getInitialPosts()];
};
