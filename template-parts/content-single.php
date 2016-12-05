<article class="content single">

  <?php
    $thumbPost = has_post_thumbnail();
    $thumbLargeDefault = wp_get_attachment_image_src(get_post_thumbnail_id($post->ID), "large");
  ?>
  
  <?php if ($thumbPost || get_field('work_video_embed')): ?>
    <div class="hero">
      <?php if ($thumbPost && get_field('work_video_embed')): ?>

        <div class="play">
          <a href="#">Play video</a>
        </div>
        
        <div class="image">
          <img src="<?php echo $thumbLargeDefault[0]; ?>" alt="<?php echo $thumbLargeDefault['alt'] ?>" />
        </div>
        
        <div class="iframe">
          <?php the_field('work_video_embed'); ?>
        </div>

      <?php elseif ($thumbPost): ?>
      
        <div class="image">
          <img src="<?php echo $thumbLargeDefault[0]; ?>" alt="<?php echo $thumbLargeDefault['alt'] ?>" />
        </div>

      <?php endif; ?>
    </div>
  <?php endif; ?>

  <div class="column column--small">

    <div class="title">
      <h2><?php the_title(); ?></h2>
    </div>

    <?php if (get_the_excerpt()): ?>
      <div class="excerpt">
        <?php the_excerpt(); ?>
      </div>
    <?php endif; ?>

    <?php if (get_field('work_content_1')): ?>
      <div class="content-1">
        <?php the_field('work_content_1'); ?>
      </div>
    <?php endif; ?>

  </div>

  <div class="column column--medium">

    <?php if (get_field('work_technical')): ?>
      <div class="content-technical">
        <p><?php the_field('work_technical'); ?></p>
      </div>
    <?php endif; ?>

    <a href="#">Read more</a>

    <?php if (get_field('work_content_2')): ?>
      <div class="content-2">
        <?php the_field('work_content_2'); ?>
      </div>
    <?php endif; ?>

  </div>
  
  <div class="column column--medium">

    <?php if (get_previous_post_link() || get_next_post_link()): ?>
      <p><?php if (get_next_post_link()): ?><?php next_post_link('%link', '%title'); ?><?php endif; ?><?php if (get_previous_post_link() && get_next_post_link()): ?> / <?php endif; ?><?php if (get_previous_post_link()): ?><?php previous_post_link('%link', '%title'); ?><?php endif; ?></p>
    <?php endif; ?>
    
    <?php if (get_field('work_pages')): ?>
      <div class="content-pages">
        <p><?php the_field('work_pages'); ?></p>
      </div>
    <?php endif; ?>

  </div>

  <?php if(have_rows('work_gallery')): ?>
    <div class="gallery">

      <?php while (have_rows('work_gallery')) : the_row(); ?>
      
      
        <div class="item<?php if(get_sub_field('work_gallery_size') == 'medium'): ?> column--medium<?php elseif(get_sub_field('work_gallery_size') == 'large'): ?> column--large<?php endif; ?>">

          <?php
            $image = get_sub_field('work_gallery_image');
            $size = 'large';
            $thumbLarge = $image['sizes'][ $size ];
            if ($image):
          ?>
            <div class="image">
              <img src="<?php echo $thumbLarge ?>" alt="<?php echo $image['alt'] ?>" />
            </div>
          <?php endif; ?>

          <?php if ($image && get_sub_field('work_gallery_video')): ?>
            <div class="video">
              <video preload="none" loop<?php if (get_sub_field('work_gallery_video_autoplay')): ?> autoplay<?php endif; ?><?php if (!get_sub_field('work_gallery_video_audio')): ?> muted<?php endif; ?> poster="<?php echo $thumbLarge ?>">
                <source src="<?php the_sub_field('work_gallery_video'); ?>" type="video/mp4">
              </video>
            </div>
          <?php endif; ?>

        </div>
      <?php endwhile; ?>

    </div>
  <?php endif; ?>

</article>
