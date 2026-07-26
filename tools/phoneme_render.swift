// Render isolated phoneme audio using AVSpeechSynthesizer with IPA notation.
//
// macOS no longer honors the legacy `say "[[inpt PHON]]..."` escape (the
// marker gets spoken aloud), so letter SOUNDS are rendered here instead:
// AVSpeechSynthesisIPANotationAttribute makes the engine produce an exact
// phoneme rather than a letter name.
//
// Usage:  swift phoneme_render.swift <out_dir> <spec_file>
// spec_file lines:  <filename>\t<ipa>\t<fallback_text>
// Writes <out_dir>/<filename>.aiff for each line.

import AVFoundation
import Foundation

let args = CommandLine.arguments
guard args.count >= 3 else {
    FileHandle.standardError.write("usage: phoneme_render <out_dir> <spec_file>\n".data(using: .utf8)!)
    exit(2)
}
let outDir = args[1]
let specPath = args[2]

guard let specText = try? String(contentsOfFile: specPath, encoding: .utf8) else {
    FileHandle.standardError.write("cannot read spec\n".data(using: .utf8)!)
    exit(2)
}

// Prefer a warm US female voice consistent with the rest of the app audio.
func pickVoice() -> AVSpeechSynthesisVoice? {
    let all = AVSpeechSynthesisVoice.speechVoices().filter { $0.language.hasPrefix("en-US") }
    if let s = all.first(where: { $0.name.contains("Samantha") }) { return s }
    if let p = all.first(where: { $0.quality == .premium }) { return p }
    if let e = all.first(where: { $0.quality == .enhanced }) { return e }
    return all.first ?? AVSpeechSynthesisVoice(language: "en-US")
}
let voice = pickVoice()
FileHandle.standardError.write("voice: \(voice?.name ?? "nil")\n".data(using: .utf8)!)

let synth = AVSpeechSynthesizer()
var failures = 0

for rawLine in specText.split(separator: "\n") {
    let parts = rawLine.components(separatedBy: "\t")
    guard parts.count >= 2 else { continue }
    let name = parts[0]
    let ipa = parts[1]
    let fallback = parts.count > 2 ? parts[2] : name

    // The spoken string is arbitrary; the IPA attribute overrides how it sounds.
    let attributed = NSMutableAttributedString(string: fallback)
    attributed.addAttribute(
        NSAttributedString.Key(rawValue: AVSpeechSynthesisIPANotationAttribute),
        value: ipa,
        range: NSRange(location: 0, length: attributed.length))

    let utt = AVSpeechUtterance(attributedString: attributed)
    if let v = voice { utt.voice = v }
    utt.rate = 0.42
    utt.pitchMultiplier = 1.0
    utt.preUtteranceDelay = 0
    utt.postUtteranceDelay = 0

    let outURL = URL(fileURLWithPath: "\(outDir)/\(name).aiff")
    var file: AVAudioFile?
    var wroteAny = false
    var finished = false

    synth.write(utt) { buffer in
        guard let pcm = buffer as? AVAudioPCMBuffer else { return }
        if pcm.frameLength == 0 {
            finished = true
            return
        }
        if file == nil {
            var settings = pcm.format.settings
            settings[AVFormatIDKey] = kAudioFormatLinearPCM
            file = try? AVAudioFile(forWriting: outURL, settings: settings,
                                    commonFormat: pcm.format.commonFormat,
                                    interleaved: pcm.format.isInterleaved)
        }
        if let f = file {
            try? f.write(from: pcm)
            wroteAny = true
        }
    }

    // Buffers are delivered on the run loop — spin it until the utterance ends.
    let deadline = Date().addingTimeInterval(10)
    while !finished && Date() < deadline {
        RunLoop.current.run(mode: .default, before: Date().addingTimeInterval(0.02))
    }
    file = nil  // close the file

    if !wroteAny {
        failures += 1
        FileHandle.standardError.write("FAIL \(name)\n".data(using: .utf8)!)
    }
}

FileHandle.standardError.write("failures: \(failures)\n".data(using: .utf8)!)
exit(failures > 0 ? 1 : 0)
