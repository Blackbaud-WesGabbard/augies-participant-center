angular.module 'trPcApp'
  .config [
    '$translateProvider'
    'APP_INFO'
    ($translateProvider, APP_INFO) ->
      $translateProvider.fallbackLanguage 'en_US'
      $translateProvider.useSanitizeValueStrategy 'escape'
      loginMessages =
        type: 'msgCat'
        bundle: 'login_user'
        keys: [
          'error_invalid_username_or_password'
          'login_button_label'
          'new_password'
          'new_password_repeat'
          'password_hint'
          'reset_password_title'
          'submit_button_label'
        ]
      trpcMessages =
        type: 'msgCat'
        bundle: 'trpc'
        keys: [
          'activity_followup_message_sent'
          'add_contact_email_label'
          'add_contact_first_name_label'
          'add_contact_last_name_label'
          'add_contact_submit_button'
          'add_contacts_cancel_link'
          'addressbookimport_header'
          'addressbookimport_importcandidatecontacts_list_select_all_label_top'
          'addressbookimport_importcandidatecontacts_list_select_label_top'
          'addressbookimport_importcandidatecontacts_list_select_none_label_top'
          'addressbookimport_selectcontacts_info'
          'addressbookimport_selectcontacts_none_selected_failure'
          'addressbookimport_selectsource_info_1'
          'addressbookimport_thirdpartystatus_info'
          'addressbookimport_tooltip_select_source_generic'
          'addressbookimport_tooltip_select_source_gmail'
          'addressbookimport_tooltip_select_source_yahoo'
          'admin_newsfeed_header_h1'
          'captains_message_edit_link'
          'captains_message_empty'
          'captains_message_header'
          'captains_message_save_button'
          'captains_save_failure'
          'captains_save_success'
          'chart_emails_sent_label'
          'chart_gift_amount_label'
          'class_cancel_link'
          'class_next_button'
          'class_or_label'
          'company_page_content_label'
          'company_page_shortcut_cancel'
          'company_page_shortcut_edit'
          'company_page_shortcut_edit2'
          'company_page_shortcut_save'
          'company_page_shortcut_save_failure'
          'company_page_shortcut_save_success'
          'company_progress_bar_title'
          'company_report_teams_label'
          'company_select_none'
          'compose_current_layout_label'
          'compose_delete_button_label'
          'compose_message_label'
          'compose_preview_button_label'
          'compose_preview_send_label'
          'compose_salutation_hint'
          'compose_save_template_button_label'
          'compose_send_button_label'
          'compose_subject_label'
          'compose_to_label'
          'contact_add_failure_email'
          'contact_add_failure_unknown'
          'contact_add_success'
          'contact_details_contact_info_hdr'
          'contact_details_edit_info'
          'contact_edit_address1_label'
          'contact_edit_address2_label'
          'contact_edit_cancel_link'
          'contact_edit_city_label'
          'contact_edit_country_label'
          'contact_edit_email_label'
          'contact_edit_first_name_label'
          'contact_edit_last_name_label'
          'contact_edit_save_button'
          'contact_edit_state_label'
          'contact_edit_zip_label'
          'contact_no_name_label'
          'contacts_acknowledge_contact_gift_no_email_body'
          'contacts_acknowledge_gift_title_label'
          'contacts_add_to_group'
          'contacts_add_to_group_button'
          'contacts_confirm_delete_body'
          'contacts_confirm_delete_groups_body'
          'contacts_confirm_delete_groups_header'
          'contacts_confirm_delete_header'
          'contacts_create_a_new_group'
          'contacts_delete_button'
          'contacts_delete_success'
          'contacts_donations_label'
          'contacts_email_all_button'
          'contacts_email_opened_label'
          'contacts_groups_all'
          'contacts_import_contacts'
          'contacts_label'
          'contacts_page_visits_label'
          'contacts_previous_amount_label'
          'contacts_select_label'
          'contacts_selected'
          'contacts_sidebar_add_contact_header'
          'contacts_warn_delete_failure_body'
          'csv_upload_contacts'
          'dashboard_company_cancel_label'
          'dashboard_company_edit_label'
          'dashboard_company_name_title'
          'dashboard_company_null_label'
          'dashboard_company_submit_label'
          'dashboard_edit_company_list_label'
          'dashboard_edit_company_name_label'
          'dashboard_enter_gift_button'
          'data_table_contacts_per_page'
          'dialog_acknowledge_label'
          'dialog_delete_label'
          'dialog_save_label'
          'donations_heading'
          'donations_no_donations_found'
          'drafts_confirm_delete_body'
          'drafts_confirm_delete_header'
          'drafts_drafts_label'
          'drafts_no_drafts_found'
          'email_compose_use_template_label'
          'email_template_radio_custom_label'
          'email_template_radio_other_label'
          'email_template_radio_recruit_label'
          'email_template_radio_solicit_label'
          'email_template_radio_thanks_label'
          'filter_email_rpt_show_donors'
          'filter_email_rpt_show_ly_donors'
          'filter_email_rpt_show_lybunt_donors'
          'filter_email_rpt_show_ly_teammates'
          'filter_email_rpt_show_ly_unreg_teammates'
          'filter_email_rpt_show_never_emailed'
          'filter_email_rpt_show_nondonors'
          'filter_email_rpt_show_nondonors_followup'
          'filter_email_rpt_show_nonteammates'
          'filter_email_rpt_show_teammates'
          'filter_email_rpt_show_unthanked_donors'
          'gift_add_another_button_label'
          'gift_add_button_label'
          'gift_addl_options_label'
          'gift_amount_label'
          'gift_billing_city_label'
          'gift_billing_first_name_label'
          'gift_billing_last_name_label'
          'gift_billing_state_label'
          'gift_billing_street1_label'
          'gift_billing_street2_label'
          'gift_billing_zip_label'
          'gift_check_number_label'
          'gift_city_label'
          'gift_confirm_delete_body'
          'gift_confirm_delete_header'
          'gift_credit_card_number_label'
          'gift_credit_expiration_date_label'
          'gift_credit_verification_code_label'
          'gift_display_personal_page_label'
          'gift_email_label'
          'gift_first_name_label'
          'gift_gift_category_label'
          'gift_last_name_label'
          'gift_payment_type_cash'
          'gift_payment_type_check'
          'gift_payment_type_credit'
          'gift_payment_type_label'
          'gift_payment_type_later'
          'gift_recongition_name_label'
          'gift_state_label'
          'gift_street1_label'
          'gift_street2_label'
          'gift_submit_success'
          'gift_zip_label'
          'goal_edit_goal'
          'goal_goal'
          'hdr_profile_link'
          'manage_membership_captain_first_name'
          'manage_membership_captain_last_name'
          'manage_membership_continue_button'
          'manage_membership_find_team'
          'manage_membership_join_team'
          'manage_membership_join_team_password_label'
          'manage_membership_join_team_radio_text'
          'manage_membership_label'
          'manage_membership_leave_team_explanation_text'
          'manage_membership_leave_team_radio_text'
          'manage_membership_search_button'
          'manage_membership_search_failure'
          'manage_membership_search_result_captain_label'
          'manage_membership_search_result_company_label'
          'manage_membership_search_results'
          'manage_membership_team_company'
          'manage_membership_team_name'
          'manage_membership_team_search_results_count'
          'manage_membership_team_search_results_found'
          'manage_membership_team_search_results_hint'
          'manage_team_captains_header'
          'message_send_success'
          'message_template_save_success'
          'nav_manage_privacy_settings_link'
          'nav_messaging'
          'nav_overview'
          'nav_public_page'
          'nav_team_page'
          'personal_page_privacy_prefix_desc'
          'personal_page_privacy_private_desc'
          'personal_page_privacy_private_label'
          'personal_page_privacy_public_desc'
          'personal_page_privacy_public_label'
          'personal_page_privacy_save_success'
          'personal_page_save'
          'personal_page_shortcut_edit'
          'personal_page_shortcut_save'
          'personal_preview_close_label'
          'privacy_settings_anonymous_option'
          'privacy_settings_radio_label'
          'privacy_settings_screenname_option'
          'privacy_settings_standard_option'
          'progress_bar_title'
          'progress_team_progress'
          'recent_activity_header'
          'report_personal_donations_download'
          'sent_message_date_label'
          'sent_message_forward_label'
          'sent_message_subject_label'
          'sent_message_to_label'
          'sent_no_sent_messages_found'
          'sent_sent_message_label'
          'sent_sent_messages_label'
          'session_timeout_log_back_in'
          'shortcut_save_failure'
          'shortcut_save_success'
          'social_share_link_text'
          'subnav_edit_survey_responses'
          'subnav_manage_captains'
          'survey_save_failure'
          'survey_save_responses_button'
          'survey_save_success'
          'team_donations_heading'
          'team_edit_team_name_label'
          'team_goal_edit_goal'
          'team_goal_goal'
          'team_page_permalink'
          'team_page_shortcut_cancel'
          'team_page_shortcut_edit'
          'team_page_shortcut_edit2'
          'team_page_shortcut_save'
          'team_password_edit_label'
          'team_report_team_donations_download'
          'team_report_team_members_download'
          'team_roster_heading'
          'teampage_shortcut_save_failure'
          'teampage_shortcut_save_success'
          'what_next_add_contacts_header'
          'what_next_followup_header'
          'what_next_question'
          'what_next_reach_out_header'
          'what_next_send_email_header'
          'what_next_send_thanks_header'
          'what_next_set_goal_header'
          'what_next_setup_your_personal_page_header'
        ]
      overrideMessages = 
        type: 'file'
        prefix: APP_INFO.rootPath + 'translation/',
        suffix: '.json'
      $translateProvider.useLoader 'useMessageCatalog', messages: [
        loginMessages
        trpcMessages
        overrideMessages
      ]
  ]