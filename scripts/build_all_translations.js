const fs = require('fs');
const path = require('path');

const koOld = require('../temp_ko.json');
const enOld = require('../temp_en.json');
const existing = require('../existing_translations.json');

const outDir = path.join(__dirname, '../src/lib/translations');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 185 keys
const allKeys = [
  'brand_name', 'nav_brand_tag', 'nav_all_tools', 'nav_convert_pdf', 'nav_to_pdf', 'nav_from_pdf',
  'nav_privacy_badge', 'nav_free_badge', 'nav_guides', 'nav_core_tools', 'nav_media_tools',
  'nav_select_lang', 'nav_current_lang',
  'badge_free_utility', 'badge_no_server', 'badge_no_login', 'badge_unlimited_free', 'badge_client_engine', 'badge_security',
  'tool_merge', 'tool_merge_desc', 'tool_split', 'tool_split_desc', 'tool_compress', 'tool_compress_desc',
  'tool_rotate', 'tool_rotate_desc', 'tool_ocr', 'tool_ocr_desc', 'tool_page_numbers', 'tool_page_numbers_desc',
  'tool_watermark', 'tool_watermark_desc', 'tool_compress_video', 'tool_compress_video_desc',
  'tool_video_to_gif', 'tool_video_to_gif_desc', 'tool_img_to_pdf', 'tool_img_to_pdf_desc',
  'tool_word_to_pdf', 'tool_word_to_pdf_desc', 'tool_ppt_to_pdf', 'tool_ppt_to_pdf_desc',
  'tool_excel_to_pdf', 'tool_excel_to_pdf_desc', 'tool_html_to_pdf', 'tool_html_to_pdf_desc',
  'tool_pdf_to_img', 'tool_pdf_to_img_desc', 'tool_pdf_to_word', 'tool_pdf_to_word_desc',
  'tool_pdf_to_ppt', 'tool_pdf_to_ppt_desc', 'tool_pdf_to_excel', 'tool_pdf_to_excel_desc',
  'tool_pdf_to_pdfa', 'tool_pdf_to_pdfa_desc', 'tool_pdf_to_hwp', 'tool_pdf_to_hwp_desc',
  'btn_select_files', 'drop_title_default', 'drop_subtitle_default', 'drop_note_privacy', 'drop_note_limit',
  'drop_badge_secure', 'drop_mascot_bubble', 'drop_drag_title', 'drop_drag_desc', 'drop_action_drop',
  'btn_download_again', 'btn_reset', 'btn_add_files',
  'processing_title', 'processing_desc', 'processing_badge', 'processing_complete', 'processing_bubble',
  'uploaded_card_success', 'uploaded_card_local_badge', 'uploaded_card_change_file', 'uploaded_card_and_more',
  'uploaded_card_total_pages', 'uploaded_card_file_size', 'uploaded_card_no_server',
  'home_mascot_bubble', 'home_hero_tag', 'home_hero_title1', 'home_hero_title2', 'home_hero_desc',
  'home_tools_title', 'home_tools_subtitle', 'home_use_now', 'home_convert_btn', 'home_extract_btn',
  'sponsor_snack_btn', 'home_why_title', 'home_table_title',
  'home_why_sec1_title', 'home_why_sec1_desc', 'home_why_sec2_title', 'home_why_sec2_desc',
  'home_faq_title', 'home_faq_subtitle', 'home_faq_q1', 'home_faq_a1', 'home_faq_q2', 'home_faq_a2', 'home_faq_q3', 'home_faq_a3',
  'home_to_pdf_sub', 'home_from_pdf_sub',
  'share_title', 'share_desc', 'share_btn', 'share_copied', 'share_bookmark', 'share_bookmark_tip',
  'video_title', 'video_header_sub', 'video_desc', 'video_tag', 'video_drop_title', 'video_drop_subtitle',
  'video_badge_local', 'video_badge_hardware', 'video_badge_mobile', 'video_step_level', 'video_step_level_desc',
  'video_opt_extreme_title', 'video_opt_extreme_sub', 'video_opt_extreme_desc', 'video_opt_extreme_badge',
  'video_opt_rec_title', 'video_opt_rec_sub', 'video_opt_rec_desc', 'video_opt_rec_badge',
  'video_opt_less_title', 'video_opt_less_sub', 'video_opt_less_desc', 'video_opt_less_badge',
  'video_selected', 'video_btn_compress', 'video_compressing', 'video_btn_reset',
  'video_result_title', 'video_result_desc', 'video_original', 'video_compressed', 'video_saved',
  'howto_badge', 'howto_heading_suffix', 'howto_subtitle',
  'faq_badge', 'faq_title', 'faq_subtitle',
  'guides_portal_badge', 'guides_portal_title', 'guides_portal_subtitle', 'guides_search_placeholder',
  'guides_cat_all', 'guides_cat_edit', 'guides_cat_convert', 'guides_cat_security', 'guides_cat_media', 'guides_cat_mobile',
  'guides_read_article', 'guides_direct_tool', 'guides_back_to_list', 'guides_quick_cta_title', 'guides_share', 'guides_copied',
  'ad_label', 'ad_placeholder_title', 'ad_placeholder_desc',
  'footer_security_title', 'footer_security_desc', 'footer_privacy_leak', 'footer_about',
  'footer_col_tools', 'footer_col_tech', 'footer_col_legal',
  'footer_privacy_link', 'footer_terms_link', 'footer_contact_link', 'footer_rights'
];

console.log('Total keys to support:', allKeys.length);
