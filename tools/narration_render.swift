// Render a whole narration line as ONE continuous utterance.
//
// The app's teaching lines mix prose with exact letter sounds:
//
//   "The letter [a-name] can say [/æ/] like in cat."
//
// Playing that as separate clips joined by gaps sounds chopped and robotic no
// matter how good the voice is. Instead this builds a single NSAttributedString
// where only the phoneme spans carry AVSpeechSynthesisIPANotationAttribute, so
// the synthesiser produces one naturally-prosodied sentence that still contains
// the exact sounds.
//
// Usage:  swift narration_render.swift <out_dir> <spec.json>
// spec.json: [{"name":"L1-1","segments":[{"text":"The letter"},
//                                        {"text":"a","ipa":"eɪ"},
//                                        {"text":"can say"},
//                                        {"text":"a","ipa":"æ"}]}, ...]
// Writes <out_dir>/<name>.aiff per entry.

import AVFoundation
import Foundation

struct Segment: Codable {
    let text: String
    let ipa: String?
}

struct Line: Codable {
    let name: String
    let segments: [Segment]
}

let args = CommandLine.arguments
guard args.count >= 3 else {
    FileHandle.standardError.write("usage: narration_render <out_dir> <spec.json>\n".data(using: .utf8)!)
    exit(2)
}
let outDir = args[1]

guard let specData = FileManager.default.contents(atPath: args[2]),
      let lines = try? JSONDecoder().decode([Line].self, from: specData) else {
    FileHandle.standardError.write("cannot read/parse spec\n".data(using: .utf8)!)
    exit(2)
}

func pickVoice() -> AVSpeechSynthesisVoice? {
    let all = AVSpeechSynthesisVoice.speechVoices().filter { $0.language.hasPrefix("en-US") }
    // Prefer the best quality actually installed; premium/enhanced sound far
    // less synthetic than the compact default.
    if let p = all.first(where: { $0.quality == .premium }) { return p }
    if let e = all.first(where: { $0.quality == .enhanced }) { return e }
    if let s = all.first(where: { $0.name.contains("Samantha") }) { return s }
    return all.first ?? AVSpeechSynthesisVoice(language: "en-US")
}

let voice = pickVoice()
FileHandle.standardError.write(
    "voice: \(voice?.name ?? "nil") quality: \(voice.map { "\($0.quality.rawValue)" } ?? "?")\n"
        .data(using: .utf8)!)

let synth = AVSpeechSynthesizer()
var failures = 0

for line in lines {
    let full = NSMutableAttributedString()
    for (i, seg) in line.segments.enumerated() {
        if i > 0 { full.append(NSAttributedString(string: " ")) }
        let piece = NSMutableAttributedString(string: seg.text)
        if let ipa = seg.ipa, !ipa.isEmpty {
            piece.addAttribute(
                NSAttributedString.Key(rawValue: AVSpeechSynthesisIPANotationAttribute),
                value: ipa,
                range: NSRange(location: 0, length: piece.length))
        }
        full.append(piece)
    }

    let utt = AVSpeechUtterance(attributedString: full)
    if let v = voice { utt.voice = v }
    utt.rate = 0.44          // a touch slower than default, for a 7-year-old
    utt.pitchMultiplier = 1.05
    utt.preUtteranceDelay = 0
    utt.postUtteranceDelay = 0

    let outURL = URL(fileURLWithPath: "\(outDir)/\(line.name).aiff")
    var file: AVAudioFile?
    var wrote = false
    var finished = false

    synth.write(utt) { buffer in
        guard let pcm = buffer as? AVAudioPCMBuffer else { return }
        if pcm.frameLength == 0 { finished = true; return }
        if file == nil {
            var settings = pcm.format.settings
            settings[AVFormatIDKey] = kAudioFormatLinearPCM
            file = try? AVAudioFile(forWriting: outURL, settings: settings,
                                    commonFormat: pcm.format.commonFormat,
                                    interleaved: pcm.format.isInterleaved)
        }
        if let f = file { try? f.write(from: pcm); wrote = true }
    }

    // Buffers arrive on the run loop; a blocking wait would starve the callback.
    let deadline = Date().addingTimeInterval(30)
    while !finished && Date() < deadline {
        RunLoop.current.run(mode: .default, before: Date().addingTimeInterval(0.02))
    }
    file = nil

    if !wrote {
        failures += 1
        FileHandle.standardError.write("FAIL \(line.name)\n".data(using: .utf8)!)
    }
}

FileHandle.standardError.write("failures: \(failures)\n".data(using: .utf8)!)
exit(failures > 0 ? 1 : 0)
