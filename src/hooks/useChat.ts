import { useState, ChangeEvent, useMemo, useCallback, FormEvent } from 'react';

type Message = {
  id: number;
  role: 'user' | 'assistant';
  content: string;
};

type Props = {
  api: string;
  headers: any;
};

type HandleSubmitProps = {
  id: number;
  prompt: string;
};

export function useChat({ api, headers }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>, options: HandleSubmitProps) => {
      e.preventDefault();

      const response = await fetch(api, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          messages: [
            ...messages,
            { role: 'user', content: options.prompt, id: options.id },
          ],
        }),
      });

      const responseId: number = Date.now();

      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let content = '';

      while (true) {
        const { value, done } = await reader.read();

        if (done) break;

        const data = JSON.parse(decoder.decode(value, { stream: true }));

        content += data.message.content;

        setMessages((prevMessages) => {
          const index = prevMessages.findIndex(({ id }) => id === responseId);

          if (index !== -1) {
            prevMessages[index].content = content;
            return [...prevMessages];
          }

          return [
            ...prevMessages,
            { role: 'user', content: options.prompt, id: options.id },
            { role: 'assistant', content: data.response, id: responseId },
          ];
        });
      }

      setInput('');
    },
    // eslint-disable-next-line
    []
  );

  return useMemo(
    () => ({
      messages,
      input,
      handleInputChange,
      handleSubmit,
    }),
    [messages, input, handleInputChange, handleSubmit]
  );
}
