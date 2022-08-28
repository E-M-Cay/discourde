declare global {
  var user_id_to_status: Map<number, number>;
  var user_id_to_vocal_channel: Map<number, number>;
  var vocal_channel_to_user_list: Map<number, number[]>;
  var user_id_to_socket_id: Map<number, string>;
  var user_id_to_media_status: Map<
    number,
    {
      microphone: boolean;
      audio: boolean;
      camera: boolean;
    }
  >;
}

export {};
