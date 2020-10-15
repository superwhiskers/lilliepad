{ sources ? import ./nix/sources.nix
, pkgs ? import ./nix { inherit sources; } }:

pkgs.mkShell {
  name = "lilliepad-shell";

  buildInputs = with pkgs; [
    latest.rustChannels.nightly.rust
    niv
    yarn
    flatbuffers
  ];
}
