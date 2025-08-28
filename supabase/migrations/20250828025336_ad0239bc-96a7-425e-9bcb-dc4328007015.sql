-- Update the existing content record to mark stream as ready and set playback_id
-- This is for the stream that shows as ready in the logs but wasn't updated in the database
UPDATE content 
SET 
  stream_status = 'ready',
  playback_id = '3544a283f1024fbfa78144af91ec76af',
  stream_thumbnail_url = 'https://videodelivery.net/3544a283f1024fbfa78144af91ec76af/thumbnails/thumbnail.jpg'
WHERE stream_id = '3544a283f1024fbfa78144af91ec76af';