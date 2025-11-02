export class CharacterConsistency {
  generateCharacterTemplate(character) {
    return {
      name: character.name,
      fixed_attributes: {
        ethnicity: character.ethnicity,
        age: character.age,
        facial_structure: {
          face_shape: character.face_shape,
          eyes: {
            color: character.eye_color,
            shape: character.eye_shape,
            size: character.eye_size,
            expression: character.eye_expression
          },
          nose: character.nose_description,
          mouth: character.mouth_description,
          distinctive_features: character.marks
        },
        body_type: {
          height: character.height,
          build: character.build,
          posture: character.posture
        },
        voice: {
          tone: character.voice_tone,
          accent: character.accent,
          pitch: character.pitch
        }
      },
      variable_attributes: {
        clothing: character.current_outfit,
        accessories: character.accessories,
        hairstyle_variations: character.hair_states
      }
    };
  }

  embedInPrompt(prompt, characters) {
    let modified = prompt;
    characters.forEach(char => {
      if (char.name && modified.includes(char.name)) {
        const serialized = JSON.stringify(char.fixed_attributes);
        const regex = new RegExp(char.name, 'g');
        modified = modified.replace(regex, `${char.name} [${serialized}]`);
      }
    });
    return modified;
  }
}
